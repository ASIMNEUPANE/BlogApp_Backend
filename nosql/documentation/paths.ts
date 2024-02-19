export default {
  paths: {
    // Blog API

    "/blogs": {
      post: {
        tags: ["blogs"],
        summary: "Create a new blog",
        description: "Return newly added blog",
        operationId: "add",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Required payload for creating new blog",
            required: true,
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
        ],
        // security: [
        //   {
        //     access_token: []
        //   }
        // ],
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

      // Get

      get: {
        tags: ["blogs"],
        summary: "Get all the blogs",
        description: "Returns all the blogs",
        operationId: "list",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Required payload for getting all blog",
            required: true,
            type: "number",
          },
          {
            name: "page",
            in: "query",
            description: "Required payload for getting all blog",
            required: true,
            type: "number",
          },
        ],
        // security: [
        //   {
        //     access_token: []
        //   }
        // ],
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

    // GetById

    "/blogs/{id}": {
      get: {
        tags: ["blogs"],
        summary: "Find blogs by ID",
        description: "Returns a single blog",
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
        // security: [
        //   {
        //     access_token: []
        //   }
        // ],
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
            description: "blog not found",
          },
        },
      },

      // Update

      put: {
        tags: ["blogs"],
        summary: "Update blog status by ID",
        description: "Returns a single blog with updated status",
        operationId: "update",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of blog to return",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "body",
            description: "Required payload for creating new blog",
            required: true,
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
        ],
        // security: [
        //   {
        //     access_token: []
        //   }
        // ],
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
            description: "blog not found",
          },
        },
      },

      // Delete

      delete: {
        tags: ["blogs"],
        summary: "Delete blog by ID",
        description: "Deletes a single b;og",
        operationId: "delete",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of todo that needs to be deleted",
            required: true,
            type: "string",
          },
        ],
        // security: [
        //   {
        //     access_token: []
        //   }
        // ],
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
            description: "blog not found",
          },
        },
      },
    },

    // Blog APi Documentation end here

    // Auth API documentation======================================================================
    "/auths/register": {
      post: {
        tags: ["auths"],
        summary: "Register new user",
        description: "Return status",
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
        security: [
          {
            access_token: [],
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

    // ==================================================================================================

    "/auths/verify": {
      post: {
        tags: ["auths"],
        summary: "Verify new Register user",
        description: "Return object",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and token to verify new register user",
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
    // complete
    "/auths/login": {
      post: {
        tags: ["auths"],
        summary: "login user",
        description: "Return token",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password to Login in the system",
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
              required: ["email", "token"],
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
            description: "Failed to Login",
          },
        },
      },
    },
    // complete

    "/auths/regenerateToken": {
      post: {
        tags: ["auths"],
        summary: "login user",
        description: "Return token",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password to Login in the system",
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
            description: "Failed to Login",
          },
        },
      },
    },
    "/auths/generateFPToken": {
      put: {
        tags: ["auths"],
        summary: "login user",
        description: "Return token",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password to Login in the system",
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
            description: "Failed to Login",
          },
        },
      },
    },
    "/auths/forget-password": {
      put: {
        tags: ["auths"],
        summary: "login user",
        description: "Return token",
        operationId: "create",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and password to Login in the system",
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
            description: "Failed to Login",
          },
        },
      },
    },
    // =======================

    "/users/": {
      get: {
        tags: ["users"],
        summary: "Get all the users",
        description: "Returns all the users",
        operationId: "list",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Required payload for getting all blog",
            required: true,
            type: "number",
          },
          {
            name: "page",
            in: "query",
            description: "Required payload for getting all blog",
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
        summary: "Get a user by id",
        description: "Returns a  user",
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
        summary: "update a user",
        description: "return a user",
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
        summary: "Change a password",
        description: "return a success",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and token to verify new register user",
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
        summary: "reset a password",
        description: "return a success",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Email and token to verify new register user",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["id", "password"],
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
        summary: "Reset a password",
        description: "Return a success",
        operationId: "update",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            description: "ID to find the user",
            required: true,
          },
          {
            in: "body",
            name: "body",
            description: "Status of the user",
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
        summary: "Delete a users",
        description: "deleting a users",
        operationId: "delete",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            description: "ID to find the user",
            required: true,
          },
          {
            in: "body",
            name: "body",
            description: "Status of the user",
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
        summary: "create new user",
        description: "Return users",
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
            description: "roles of the user",
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
