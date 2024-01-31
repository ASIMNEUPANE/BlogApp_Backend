import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import controller from "./controller";
import { ZodError } from "zod";
import { blogSchemaValidator, imageSchema } from "../../utils/dataValidator";

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

      const { title, content, description, category,totalWord, status, author } =
        blogSchemaValidator.parse(req.body);
        
        imageSchema.parse(req.file?.filename);

      req.body.images = req.file ? "blog/" + req.file.filename : "";
      const result = await controller.create(req.body);
      res.status(200).json({ data: result, msg: "Success" });

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "invalid data", details: error.errors });
      } else {
        next(error);
      }
    }
  }
);

export default router;
