import supertest from "supertest";
// import { app } from "../../index";
import createServer from "../../utils/server";

const app = createServer();

describe("blogs", () => {
  describe("get blogs routes", () => {
    describe("given the product does not exist ", () => {
      it("should return a 404",async () => {
        const blogId = "blogs-1342";

        await supertest(app).get(`/api/v1/blogs/${blogId}`)
      });
    });
  });
});
