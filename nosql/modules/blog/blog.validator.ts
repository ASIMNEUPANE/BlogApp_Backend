import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const blogSchemaValidator = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  category:z.enum(['Technology', 'Travel', 'Food', 'Lifestyle']),
  totalWord: z.number().min(1),
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

export default validateBlogDataMiddleware;
