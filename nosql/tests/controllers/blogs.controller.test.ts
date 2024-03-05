import blogModel from "../../modules/blog/blog.model";
import common from "../common";
import {
  create,
  deleteById,
  get,
  getById,
  updateById,
} from "../../modules/blog/blog.controller";
import { title } from "process";
// import MongoClient from "mongodb";

const blogData = {
  _id: "id-1",
  title: "wonder-world",
  content: "best of the world",
  description: "boom blastic...",
  category: "Technology",
  status: "published",
  author: "asim the don",
  totalWord: 11,
  images: "images.jpg",
};

jest.spyOn(blogModel, "create");
jest.spyOn(blogModel, "findOne");
jest.spyOn(blogModel, "findOneAndUpdate");
jest.spyOn(blogModel, "deleteOne");

// Add Operation

describe("Blog controller Test", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });
  afterAll(async () => {
    await common.closeDatabase();
  });

  // Create Operation
  describe("create blog", () => {
    it("create & save blog successfully", async () => {
      jest.spyOn(blogModel, "create").mockResolvedValue(blogData);
      const createdBlog = await create(blogData);
      expect(createdBlog).toBe(blogData);

      expect(blogModel.create).toHaveBeenCalledWith(blogData);
    });
  });

  // List Operation
    describe("list all blog", () => {
      it("lists all blogs", async () => {
        const allData = await get(2, 2, "");

        // Assertion to check if allData is an object
        expect(typeof allData).toBe("object");

        // Assertion to check if allData contains a property named 'data'
        expect(allData).toHaveProperty("data");

        // If there is no data returned, expect 'data' property to be an empty array
        if (allData.data.length === 0) {
          expect(allData.data).toEqual([]);
        } else {
          // Assertion to check if 'data' property is an array
          expect(Array.isArray(allData.data)).toBe(true);

          // Assertion to check if each item in 'data' array is an object
          allData.data.forEach((item) => {
            expect(typeof item).toBe("object");
          });
        }
      });
    });

  //   // Get By Id Operation
  describe("Get blog by id ", () => {
    it("Get a blog by id", async () => {
      jest.spyOn(blogModel, "create").mockResolvedValue(blogData);
      jest.spyOn(blogModel, "findOne").mockResolvedValue(blogData);
      const createdBlog = await create(blogData);

      const getData = await getById(createdBlog._id);
      expect(getData).toBeDefined();
      expect(getData?.title).toBe(getData?.title);
      expect(blogModel.create).toHaveBeenCalledWith(blogData);
      expect(blogModel.findOne).toHaveBeenCalledWith({ _id: blogData._id });
    });
  });
  //   // Update By Id Operation
  describe("Update blog by id", () => {
    it("Update a blog by id", async () => {
      jest
        .spyOn(blogModel, "findOneAndUpdate")
        .mockResolvedValue(
          { _id: blogData._id, title: "newTitle" },
          { new: true }
        );

      // Update the blog
      const updatedBlog = await updateById(blogData._id, { title: "newTitle" });

      // Assert that findOneAndUpdate was called with the correct parameters
      expect(blogModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: blogData._id },
        { title: "newTitle" },
        { new: true }
      );

      // Assertion to check if title matches the updated title
      expect(updatedBlog?.title).toBe("newTitle");
    });
  });

  // Delete an blog by id
  describe("delete by id", () => {
    it("Delete a blog by Id ", async () => {
      jest
        .spyOn(blogModel, "deleteOne")
        .mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const deletedBlog = await deleteById(blogData._id);

      // Step 5: Assertion
      expect(deletedBlog?.deletedCount).toBe(1);
      expect(blogModel.deleteOne).toHaveBeenCalledWith({ _id: blogData._id });
    });
  });
  // });
});
