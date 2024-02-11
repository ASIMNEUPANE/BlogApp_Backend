const apiLocation = "localhost:3333"; // Set this to the hostname of your API server
const apiVersion = "/api/v1";

export default {
  swagger: "2.0", // Change this to the correct version of Swagger you're using
  info: {
    title: "Blog System API Documentation",
    version: "1.0",
    description:
      "This is API Documentation for this blog application made with Express and documented with Swagger.",
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      email: "asimneupane11@gmail.com",
    },
  },
  schemes: ["http", "https"],
  host: apiLocation,
  basePath: apiVersion,
  // securityDefinitions: {
  //   access_token: {
  //     type: "apiKey",
  //     in: "header",
  //     name: "access_token",
  //     description: "get token using user login method",
  //   },
  // },
};
