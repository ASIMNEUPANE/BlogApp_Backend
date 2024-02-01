import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./controller";
import { ZodError } from "zod";
import { blogSchemaValidator, imageSchema } from "../../middlewares/dataValidator";

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.totalWord = Number(req.body.totalWord);

      const {
        title,
        content,
        description,
        category,
        totalWord,
        status,
        author,
      } = blogSchemaValidator.parse(req.body);

      imageSchema.parse(req.file?.filename);

      req.body.images = req.file ? "blog/" + req.file.filename : "";
      const result = await controller.create(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: "invalid data", details: err.errors });
      } else {
        next(err);
      }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, "body");
      console.log(req.file, "file");
      req.body.totalWord = Number(req.body.totalWord);
      const {
        title,
        content,
        description,
        category,
        totalWord,
        status,
        author,
      } = blogSchemaValidator.parse(req.body);

      imageSchema.parse(req.file?.filename);
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
