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
    it("should return paginated data and total count", async () => {
      const page = 1,
        page2 = 2;
      const limit = 4;

      // Mock data for model.aggregate
      jest.spyOn(blogModel, "aggregate").mockResolvedValue([
        {
          total: [{ total: 2 }], // Assuming total count is 2
          data: [
            {
              _id: "id-1",
              title: "blog-1",
              content: "best of the world",
              description: "boom blastic...",
              category: "Technology",
              status: "published",
              author: "asim the don",
              totalWord: 11,
              images: "images.jpg",
            },
            {
              _id: "id-2",
              title: "blog-2",
              content: "best of the world",
              description: "boom blastic...",
              category: "Technology",
              status: "published",
              author: "asim the don",
              totalWord: 11,
              images: "images.jpg",
            },
          ],
        },
      ]);

      // Call the get function
      const result = await get(limit, page);
      console.log({ result }, "dattttttaaaaaa");

      // Call the get function for the second page
      const pageTworesult = await get(limit, page2);
      console.log({ pageTworesult });

      // Check if the result matches the expected result
      expect(result?.data).toHaveLength(2);
      expect(result?.page).toBe(page);
      expect(result?.limit).toBe(limit);

      // Page 2 Test
      expect(pageTworesult?.data).toHaveLength(2); // Assuming page 2 should have no data
      expect(pageTworesult?.total).toEqual([{ total: 2 }]); // Assuming total count remains the same
      expect(pageTworesult?.page).toBe(page2);
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
