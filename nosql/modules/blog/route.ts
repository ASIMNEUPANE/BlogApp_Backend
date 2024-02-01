import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./blog.controller";
import validateBlogDataMiddleware from "./zod.validator";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/blog");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "." + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("images"),
  validateBlogDataMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.images = req.file ? "blog/" + req.file.filename : "";
      const result = await controller.create(req.body);
        res.status(200).json({ data: result, msg: "success" });
      
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.get();
    res.status(200).json({ data: result, msg: "success" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.getById(req.params.id);
    res.json({ data: result, msg: "success" });
  } catch (err) {
    next(err);
  }
});
router.put(
  "/:id",
  upload.single("images"),
  validateBlogDataMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.updated_at = new Date();
      req.body.images = req.file ? "blog/" + req.file?.filename : "";

      const result = await controller.updateById(req.params.id, req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.deleteById(req.params.id);
      res.json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
