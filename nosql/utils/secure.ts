import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "./jwt";
import userModel from "../modules/users/user.model";
import { JwtPayload } from "jsonwebtoken";

const compareRole = (requiredRole: string[], userRole: string[]) => {
  if (requiredRole.length < 1) return true;
  return userRole.some((v) => requiredRole.indexOf(v) !== -1);
};

const secureAPI = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new Error("Access token required");
      const accessToken = token.split("Bearer ")[1];
      const { data } = verifyJWT(accessToken) as JwtPayload;
      if (!data) throw new Error("Data is not available");
      const { email } = data;
      const user = await userModel.findOne({ email });
      if (!user) throw new Error("User not found");
      (req as any).currentUser = user?._id;
      (req as any).currentRoles = user?.roles;
      const isValidRole = compareRole(roles, user?.roles || []);
      if (!isValidRole) throw new Error("User unauthorized");
      next();
    } catch (e) {
      next(e);
    }
  };
};

export default secureAPI;
