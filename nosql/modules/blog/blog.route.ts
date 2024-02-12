import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./blog.controller";
import {validateBlogDataMiddleware,validateLimit,updateValidateBlogDataMiddleware} from "./blog.validator";

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

router.use((req, res, next) => {
  if (req.method === "GET" || req.method === "DELETE" || req.method === "PUT") {
    // Skip validation for 'GET' and 'DELETE'
    return next();
  }
  // Continue validation for other methods

  validateBlogDataMiddleware(req, res, next);
});
router.use(upload.single("images"));


router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.images = req.file ? `blog/${req.file.filename}` : "";
    const result = await controller.create(req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (err) {
    next(err);
  }
});

router.get("/", validateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, page, search } = req.query;
    const result = await controller.get(String(limit), String(page), String(search));
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

router.put("/:id", updateValidateBlogDataMiddleware,async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.images = req.file ? `blog/${req.file.filename}` : "";

    const result = await controller.updateById(req.params.id, req.body);
    res.status(200).json({ data: result, msg: "success" });
  } catch (err) {
    next(err);
  }
});

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
