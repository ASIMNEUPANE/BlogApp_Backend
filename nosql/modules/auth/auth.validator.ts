import { z } from "zod";

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
  roles: z.enum(["admin", "user"]).optional(),
  isEmailVerified: z.boolean().optional(),
  isActive:z.boolean().optional()
});
