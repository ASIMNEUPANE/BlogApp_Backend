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

router.post(
  "/",
  upload.single("images"),
  secureAPI(["admin"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body.created_by = req.currentUser;
      // req.body.updated_by = req.currentUser;
      req.body.created_at = new Date();
      const result = await controller.create(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    console.log(req.query);
    const { limit, page, search } = req.query;
    const result = await controller.get(
      String(limit),
      String(page),
      String(search)
    );
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

router.get(
  "/profile",
  secureAPI(["admin", "user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.getById(req.currentUser);
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);
router.put(
  "/profile",
  secureAPI(["admin", "user"]),
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req?.file) {
        req.body.image = "users/".concat(req.file.filename);
      }

      const { id, ...rest } = req.body;
      rest.created_by = req.currentUser;
      rest.updated_by = req.currentUser;
      const me = req.currentRoles.includes("admin")
        ? req.body.id
        : req.currentUser;
      if (!me) throw new Error("User ID is required");
      const result = await controller.updateById(id, rest);
      res.status(200).json({ data: result, msg: "success" });
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/change-password",
  secureAPI(["user","admin"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword, id } = req.body;
      if (!oldPassword || !newPassword)
        throw new Error("Passwords are missing");
      const result = await controller.changePassword(
        id,
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
    const { id, ...rest } = req.body;
    // rest.created_by = req.currentUser;
    // rest.updated_by = req.currentUser;
    const result = await controller.resetPassword(id, rest);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

router.patch("/status/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    // req.body.created_by = req.currentUser;
    // req.body.updated_by = req.currentUser;
    const result = await controller.block(req.params.id, req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    console.log(req.params.id,'params')
    const result = await controller.getById(req.params.id);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    // req.body.created_by = req.currentUser;
    // req.body.updated_by = req.currentUser;
    req.body.updated_at = new Date();

    const result = await controller.archive(req.params.id, req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (e) {
    next(e);
  }
});

export default router;
