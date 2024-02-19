import express, { NextFunction, Request, Response, Router } from "express";

import { verifyJWT } from "./jwt";
import userModel from "../modules/users/user.model";

const compareRole = (requiredRole: string, userRole: string) => {
  if (requiredRole.length < 1) return true;
  return userRole.some((v) => requiredRole.indexOf(v) !== -1);
};

const secureAPI = (roles: [string, string?]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) throw new Error("Acces token require");
      const accesToken = token.split("Bearer ")[1];
      const { data } = verifyJWT(accesToken);
      // if (!data) throw new Error("Data is not availabe");
      const { email } = data;
      // check if the user has required role or not
      const user = await userModel.findOne({ email });
      if (!user) throw new Error("user not found");
      req.currentUser = user?._id;
      req.currentRoles = user?.roles;
      // compare role against secureAPI passed role
      const isValidRole = compareRole(roles ?? [], user?.roles);
      if (!isValidRole) throw new Error("user unathorized");
      next();
    } catch (e) {
      next(e);
    }
  };
};
export default secureAPI;
