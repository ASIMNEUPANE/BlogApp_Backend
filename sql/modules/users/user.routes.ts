import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./user.controller";
import secureAPI from "../../utils/secure";
import { authValidatorMiddleware } from "../auth/auth.validator";
import { limitValidatorMiddleware, updateMiddleware } from "./user.validator";

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
  "/",
  upload.single("images"),
  authValidatorMiddleware,
  secureAPI(["admin"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.images = req.file ? `blog/${req.file.filename}` : "";
      req.body.created_by = (req as any).currentUser;
      req.body.updated_by = (req as any).currentUser;
      req.body.created_at = new Date();
      const result = await controller.create(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/",
  limitValidatorMiddleware,
  secureAPI(["admin"]),
  async (req, res, next) => {
    try {
      console.log(req.query);
      const { limit, page } = req.query;
      const result = await controller.get(
        Number(limit),
        Number(page),
      );
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/profile",
  secureAPI(["admin", "users"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.getById((req as any).currentUser );
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);
router.put(
  "/update/profile",
  secureAPI(["admin", "users"]),
  upload.single("images"),
  updateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req?.file) {
        req.body.image = "users/".concat(req.file.filename);
      }

      const { id, ...rest } = req.body;
      rest.created_by =(req as any).currentUser;
      rest.updated_by =(req as any).currentUser;
      const me = req.body.id ? req.body.id : (req as any).currentUser;
      if (!me) throw new Error("User ID is required");
      const result = await controller.updateById(me, rest);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/change-password",
  secureAPI(["admin", "users"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword)
        throw new Error("Passwords are missing");
      const me = req.body.id ? req.body.id : (req as any).currentUser;
      const result = await controller.changePassword(
        me,
        oldPassword,
        newPassword
      );
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.put("/reset-password", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const { id, password } = req.body;
    const result = await controller.resetPassword(id, password);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

router.patch("/status/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.created_by = (req as any).currentUser;
    req.body.updated_by = (req as any).currentUser;
    const result = await controller.block(req.params.id, req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await controller.getById(req.params.id);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.created_by = (req as any).currentUser;
    req.body.updated_by = (req as any).currentUser;
    req.body.updated_at = new Date();

    const result = await controller.archive(req.params.id, req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

export default router;
