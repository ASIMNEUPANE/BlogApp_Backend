export default {
  paths: {
    "/blogs": {
      post: {
        tags: ["blogs"],
        summary: "Create a new blog",
        description: "Creates a new blog and returns the newly added blog.",
        operationId: "add",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Payload for creating a new blog",
            required: true,
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          500: {
            description: "Invalid blogs",
          },
        },
      },
      get: {
        tags: ["blogs"],
        summary: "Get all the blogs",
        description: "Returns all the blogs.",
        operationId: "list",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Limit for number of blogs per page",
            required: true,
            type: "number",
          },
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: true,
            type: "number",
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          500: {
            description: "Invalid Operation",
          },
        },
      },
    },
    "/blogs/{id}": {
      get: {
        tags: ["blogs"],
        summary: "Find blogs by ID",
        description: "Returns a single blog based on the provided ID.",
        operationId: "getById",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of blog to return",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Blog not found",
          },
        },
      },
      put: {
        tags: ["blogs"],
        summary: "Update blog status by ID",
        description:
          "Updates the status of a blog based on the provided ID and returns the updated blog.",
        operationId: "update",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of blog to update",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "body",
            description: "Payload for updating the blog status",
            required: true,
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Blog not found",
          },
        },
      },
      delete: {
        tags: ["blogs"],
        summary: "Delete blog by ID",
        description: "Deletes a single blog based on the provided ID.",
        operationId: "delete",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of blog to delete",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Blog not found",
          },
        },
      },
    },
    "/auths/register": {
      post: {
        tags: ["auths"],
        summary: "Register new user",
        description:
          "Registers a new user with provided details and returns status.",
        operationId: "create",
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        parameters: [
          {
            in: "formData",
            name: "images",
            type: "file",
            description: "Image file to upload",
            required: true,
          },
          {
            in: "formData",
            name: "name",
            type: "string",
            description: "Name of the user",
            required: true,
          },
          {
            in: "formData",
            name: "email",
            type: "string",
            description: "Email of the user",
            required: true,
          },
          {
            in: "formData",
            name: "password",
            type: "string",
            description: "Password of the user",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/auths",
            },
          },
          500: {
            description: "Invalid register",
          },
        },
      },
    },
    "/auths/verify": {
      post: {
        tags: ["auths"],
        summary: "Verify new Register user",
        description: "Verifies a newly registered user with email and token.",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and token to verify new registered user",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                token: {
                  type: "string",
                },
              },
              required: ["email", "token"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/auths",
            },
          },
          500: {
            description: "Invalid register",
          },
        },
      },
    },
    "/auths/login": {
      post: {
        tags: ["auths"],
        summary: "Login user",
        description:
          "Logs in a user with provided email and password and returns token.",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password for login",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["email", "password"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/login",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Failed to login",
          },
        },
      },
    },
    "/auths/regenerateToken": {
      post: {
        tags: ["auths"],
        summary: "Regenerate token",
        description: "Regenerates token for a user with provided email.",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email to regenerate token",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
              },
              required: ["email"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/auths",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Failed to login",
          },
        },
      },
    },
    "/auths/generateFPToken": {
      put: {
        tags: ["auths"],
        summary: "Generate forget password token",
        description: "Generates token for password reset with provided email.",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email to generate forget password token",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
              },
              required: ["email"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/auths",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Failed to login",
          },
        },
      },
    },
    "/auths/forget-password": {
      put: {
        tags: ["auths"],
        summary: "Forget password",
        description: "Initiates password reset process and returns token.",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password for login",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                token: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["email"],
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/forgetPassword",
            },
          },
          400: {
            description: "Invalid ID supplied",
          },
          500: {
            description: "Invalid Operation",
          },
          404: {
            description: "Failed to login",
          },
        },
      },
    },
    "/users/": {
      get: {
        tags: ["users"],
        summary: "Get all the users",
        description: "Returns all the users.",
        operationId: "list",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Limit for number of users per page",
            required: true,
            type: "number",
          },
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: true,
            type: "number",
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid Operation",
          },
        },
      },
    },
    "/users/profile": {
      get: {
        tags: ["users"],
        summary: "Get a user by ID",
        description: "Returns a user by ID.",
        operationId: "list",
        consumes: ["application/json"],
        produces: ["application/json"],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid Operation",
          },
        },
      },
    },
    "/users/update/profile": {
      put: {
        tags: ["users"],
        summary: "Update a user",
        description: "Updates user profile information.",
        operationId: "update",
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        parameters: [
          {
            in: "formData",
            name: "images",
            type: "file",
            description: "Image file to upload",
          },
          {
            in: "formData",
            name: "name",
            type: "string",
            description: "Name of the user",
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid updated",
          },
        },
      },
    },
    "/users/change-password": {
      put: {
        tags: ["users"],
        summary: "Change password",
        description: "Changes the password of a user.",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Payload for changing password",
            required: true,
            schema: {
              type: "object",
              properties: {
                oldPassword: {
                  type: "string",
                },
                newPassword: {
                  type: "string",
                },
              },
              required: ["oldPassword", "newPassword"],
            },
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid updated",
          },
        },
      },
    },
    "/users/reset-password": {
      put: {
        tags: ["users"],
        summary: "Reset password",
        description: "Resets the password of a user.",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Payload for resetting password",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                token: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["email", "token", "password"],
            },
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid updated",
          },
        },
      },
    },
    "/users/status/{id}": {
      patch: {
        tags: ["users"],
        summary: "Update user status",
        description: "Updates the status of a user by ID.",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            description: "ID of the user to update status",
            required: true,
          },
          {
            in: "body",
            name: "body",
            description: "New status of the user",
            required: true,
            schema: {
              type: "object",
              properties: {
                isActive: {
                  type: "boolean",
                },
              },
            },
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          "500": {
            description: "Invalid update",
          },
        },
      },
    },
    "/users/{id}": {
      delete: {
        tags: ["users"],
        summary: "Delete a user",
        description: "Deletes a user by ID.",
        operationId: "delete",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            description: "ID of the user to delete",
            required: true,
          },
          {
            in: "body",
            name: "body",
            description: "Optional additional data",
            required: true,
            schema: {
              type: "object",
              properties: {
                isArchive: {
                  type: "boolean",
                },
              },
            },
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          "500": {
            description: "Invalid update",
          },
        },
      },
    },
    "/users": {
      post: {
        tags: ["users"],
        summary: "Create a new user",
        description: "Creates a new user.",
        operationId: "create",
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        parameters: [
          {
            in: "formData",
            name: "images",
            type: "file",
            description: "Image file to upload",
            required: true,
          },
          {
            in: "formData",
            name: "name",
            type: "string",
            description: "Name of the user",
            required: true,
          },
          {
            in: "formData",
            name: "email",
            type: "string",
            description: "Email of the user",
            required: true,
          },
          {
            in: "formData",
            name: "password",
            type: "string",
            description: "Password of the user",
            required: true,
          },
          {
            in: "formData",
            name: "roles",
            type: "string",
            description: "Roles of the user",
            required: true,
          },
        ],
        security: [
          {
            access_token: [],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              $ref: "#/definitions/users",
            },
          },
          500: {
            description: "Invalid create a users",
          },
        },
      },
    },
  },
};
