import express, { NextFunction, Request, Response, Router } from "express";
import {
  register,
  verify,
  regenerateToken,
  login,
  generateFPToken,
  forgetPassowrd,
} from "./auth.controller";
import multer from "multer";

import {
  authValidatorMiddleware,
  verifyAuthMiddleware,
} from "./auth.validator";
const router: Router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/users");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "." + file.originalname.split(".")[1];
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("images"),
  authValidatorMiddleware,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req?.file) {
        req.body.images = req.file ? `blog/${req.file.filename}` : "";
      }
      const result = await register(req.body);
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
      const result = await verify(req.body);
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
      console.log(req.body)
      const { email } = req.body;
      if (!email) throw new Error("Email  is missing");
      const result = await regenerateToken(email);
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
      const result = await login(email, password);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);
router.put(
  "/generateFPToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      console.log(email,'route')
      if (!email) throw new Error("Email is missing");
      const result = await generateFPToken(email);
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
      const result = await forgetPassowrd(email, token, password);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
