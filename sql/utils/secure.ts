import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../DB/db.config";

const secureAPI = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new Error("Access token required");
      const accessToken = token.split("Bearer ")[1];
      const { data } = verifyJWT(accessToken) as JwtPayload;
      if (!data) throw new Error("Data is not available");
      const { email } = data;
      const user = await prisma.user.findUnique({where:{ email} });
      if (!user) throw new Error("User not found");
      (req as any).currentUser = user?.id;
      (req as any).currentRoles = user?.roles;
      const isValidRole = roles.some((role) => user.roles.includes(role));
      if (!isValidRole) throw new Error("User unauthorized");
      next();
    } catch (e) {
      next(e);
    }
  };
};

export default secureAPI;
