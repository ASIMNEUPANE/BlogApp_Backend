import express, { NextFunction, Request, Response, Router } from "express";
import controller from "./auth.controller";
import {
  authValidatorMiddleware,
  verifyAuthMiddleware,
} from "./auth.validator";
const router: Router = express.Router();

router.post(
  "/register",
  authValidatorMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.register(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  "/verify",
  verifyAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.verify(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  "/generateToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const { email } = req.body;
      if (!email) throw new Error("Email  is missing");
      const result = await controller.regenerateToken(email);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email) throw new Error("Email  is missing");
      const result = await controller.login(email, password);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  "/regenerateToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      console.log(email,'route')
      if (!email) throw new Error("Email is missing");
      const result = await controller.regenerateToken(email);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.put(
  "/forget-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, token,password } = req.body;
      console.log(typeof(token))
      if (!email || !password || !token)
        throw new Error("Email or Password or token is missing");
      const result = await controller.forgetPassowrd(email, token, password);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);


export default router;
