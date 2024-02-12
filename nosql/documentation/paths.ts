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
  },
};
