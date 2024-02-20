import supertest from "supertest";
import { app } from "../../index";

describe("blogs", () => {
  describe("get blogs route", () => {
    describe("given the blogs does not exist", () => {
      it("should return a 404", async () => {
        const blogsId = "blog-123";
        await supertest(app).get(`/api/v1/blogs/${blogsId}`).expect(404);
      });
    });
  });
});
