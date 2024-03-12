import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import {
  // get,
  getById,
  create,
  updateById,
  deleteById,
} from "./blog.controller";
import {
  validateBlogDataMiddleware,
  validateLimit,
  updateValidateBlogDataMiddleware,
} from "./blog.validator";
import secureAPI from "../../utils/secure";
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

// router.use((req, res, next) => {
//   if (req.method === "GET" || req.method === "DELETE" || req.method === "PUT") {
//     // Skip validation for 'GET' and 'DELETE'
//     return next();
//   }
//   // Continue validation for other methods

//   validateBlogDataMiddleware(req, res, next);
// });
router.use(upload.single("images"));

router.post(
  "/",
  validateBlogDataMiddleware,
  secureAPI(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.images = req.file ? `blog/${req.file.filename}` : "";
      const totalWord = parseInt(req.body.totalWord);
      req.body.totalWord = totalWord;
      req.body.userId = (req as any).currentUser;

      const result = await create(req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);

// router.get(
//   "/",
//   validateLimit,
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { limit, page } = req.query;
//       const result = await get(Number(limit), Number(page));
//       res.status(200).json({ data: result, msg: "success" });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getById(+req.params.id);
    res.json({ data: result, msg: "success" });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  updateValidateBlogDataMiddleware,
  secureAPI(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.images = req.file ? `blog/${req.file.filename}` : "";

      const result = await updateById(+req.params.id, req.body);
      res.status(200).json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  secureAPI(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteById(+req.params.id);
      res.json({ data: result, msg: "success" });
    } catch (err) {
      next(err);
    }
  }
);
export default router;
