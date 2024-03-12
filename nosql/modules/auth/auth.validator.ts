import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const registerValidator = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Too short" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one numeric digit" })
    .regex(/[!@#$%^&*]/, {
      message: "Must contain at least one special character",
    }),
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
    )
    .optional(),
  
});


const authValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const images = req.file ? req.file.path : undefined;

    const dataToValidate = {name,email, password,images} ;

    registerValidator.parse(dataToValidate);
    next();
  } catch (err) {
    next(err);
  }

}

export const verify = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
    token: z.string(), // 6-digit number
  })
const verifyAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataToValidate = req.body ;
    verify.parse(dataToValidate);
    next();
  } catch (err) {
    next(err);
  }

}

export {authValidatorMiddleware,verifyAuthMiddleware}
