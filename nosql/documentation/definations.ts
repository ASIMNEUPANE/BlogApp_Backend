export default {
  definitions: {
    // Schedules Model
    blogs: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
        description: { type: "string" },
        category: {
          type: "string",
          enum: ["Technology", "Travel", "Food", "Lifestyle"],
          default: "Technology",
        },
        status: {
          type: "string",
          enum: ["published", "draft"],
          default: "draft",
        },
        author: { type: "string" },
        totalWord: { type: "number" },
        images: { type: "string" },
      },
    },
    auths: {
      type: "object",
      properties: {
        data: { type: "string" },
        msg: { type: "string" },
      },

      
    },
    login: {
      type: "object",
      properties: {
        data: { type: "object" },
        msg: { type: "string" },
      },
    },
    forgetPassword: {
      type: "object",
      properties: {
        data: { type: "boolean" },
      },
    },
    users: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string", required: true },
        email: {
          type: "string",
        },
        isEmailVerified: { type: "boolean", default: false },

        password: { type: "string" },
        roles: {
          type: "string",
          enum: ["user", "admin"],
          default: ["user"],
        },
        images: { type: "string" },

        isActive: { type: "boolean", default: false },
        isArchive: { type: "boolean", default: false },
      },
    },
  },
};
