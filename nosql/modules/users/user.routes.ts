import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./user.controller";
import secureAPI from "../../utils/secure";

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

router.post("/", secureAPI(["admin"]), upload.single("images"),async (req:Request, res:Response, next:NextFunction) => {
  try {
    // req.body.created_by = req.currentUser;
    // req.body.updated_by = req.currentUser;
    req.body.created_at = new Date();
    const result = await controller.create(req.body);
    res.json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

export default router;
