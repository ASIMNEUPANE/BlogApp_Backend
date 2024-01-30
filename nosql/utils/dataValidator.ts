const { z } = require('zod');

const blogSchemaValidator = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    author: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    status: z.string().min(1),
    images: z.string().optional(),
    // totalWord: z.number().min(1),
});

export default blogSchemaValidator