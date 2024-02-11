export default {
  definitions: {
    // Schedules Model
    blogs: {
      type: "object",
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        description: { type: 'string' },
        category: {
          type: 'string',
          enum: ["Technology", "Travel", "Food", "Lifestyle"],
          default: "Technology",
        },
        status: {
          type: 'string',
          enum: ["published", "draft"],
          default: "draft",
        },
        author: { type: 'string' },
        totalWord: { type: 'number' },
        images: { type: 'string' },
      },
    },
  },
};
