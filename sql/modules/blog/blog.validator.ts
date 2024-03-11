import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const blogSchemaValidator = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  category:z.enum(['Technology', 'Travel', 'Food', 'Lifestyle']),
  totalWord: z.string().min(1),
  status: z.enum(['published' , 'draft']),
  images: z
    .string()
    .refine(
      (value: any) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const lowercasedValue = value.toLowerCase();

        return allowedExtensions.some((ext) => lowercasedValue.endsWith(ext));
      },
      {
        message:
          "Invalid image file path. Supported formats: jpg, jpeg, png, gif",
      }
    ).optional()
    ,
});

const updateSchemaValidator = blogSchemaValidator.partial();

const limitValidator = z.object({
  size: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
  search:z.string().min(1).optional()
})

const validateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataToValidate = req.query ;
    limitValidator.parse(dataToValidate);
    next();
  } catch (err) {
    next(err);
  }
};
const validateBlogDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataToValidate = req.body || { images: req.file?.filename };
    blogSchemaValidator.parse(dataToValidate);
    next();
  } catch (err) {
    next(err);
  }
};
const updateValidateBlogDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataToValidate = req.body || { images: req.file?.filename };
    updateSchemaValidator.parse(dataToValidate);
    next();
  } catch (err) {
    next(err);
  }
};

export  {validateBlogDataMiddleware,validateLimit,updateValidateBlogDataMiddleware};
