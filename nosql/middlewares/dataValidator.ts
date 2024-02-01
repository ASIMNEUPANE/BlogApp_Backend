const { z } = require("zod");

const blogSchemaValidator = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  totalWord: z.number().min(1),
  status: z.string().min(1),
});
const imageSchema = z.string().refine(
  (value: any) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const lowercasedValue = value.toLowerCase();

    return allowedExtensions.some((ext) => lowercasedValue.endsWith(ext));
  },
  {
    message: "Invalid image file path. Supported formats: jpg, jpeg, png, gif",
  }
);


export { blogSchemaValidator, imageSchema };
