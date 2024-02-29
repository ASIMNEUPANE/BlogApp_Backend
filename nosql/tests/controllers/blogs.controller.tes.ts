import common from "../common";
import {
  create,
  deleteById,
  get,
  getById,
  updateById,
} from "../../modules/blog/blog.controller";
// import MongoClient from "mongodb";

const blogData = {
  title: "wonder-world",
  content: "best of the world",
  description: "boom blastic...",
  category: "Technology",
  status: "published",
  author: "asim the don",
  totalWord: 11,
  images: "images.jpg",
};

// Add Operation

describe("Blog controller Test", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });
  afterAll(async () => {
    await common.closeDatabase();
  });

  // Create Operation

  it("create & save blog successfully", async () => {
    console.log("Creating blog...");
    const createdBlog = await create(blogData);
    expect(createdBlog.title).toBe(blogData.title);
    expect(createdBlog.content).toBe(blogData.content);
    expect(createdBlog.description).toBe(blogData.description);
    expect(createdBlog.category).toBe(blogData.category);
    expect(createdBlog.status).toBe(blogData.status);
    expect(createdBlog.author).toBe(blogData.author);
    expect(createdBlog.totalWord).toBe(blogData.totalWord);
    expect(createdBlog.images).toBe(blogData.images);
    expect(createdBlog._id).toBeDefined();
    expect(createdBlog.createdAt).toBeDefined();
    expect(createdBlog.updatedAt).toBeDefined();
  });
  // List Operation

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

  // Get By Id Operation

  it("Get a blog by id", async () => {
    const createdBlog = await create(blogData);
    const getData = await getById(createdBlog._id);
    expect(getData).toBeDefined();
    expect(getData?.title).toBe(getData?.title);
  });

  // Update By Id Operation

  it("Update a blog by id", async () => {
    const createdBlog = await create(blogData);

    // Debugging output
    const updatedBlog = await updateById(createdBlog._id, { title: "Hello" });

    // Debugging output

    // Assertion to check if updated data is defined
    expect(updatedBlog).toBeDefined();

    // Assertion to check if title matches the updated title
    expect(updatedBlog?.title).toBe("Hello");
  });

  // Delete an blog by id

  it("Delete a blog by Id ", async () => {
    const createdBlog = await create(blogData);
    console.log("Created Blog:", createdBlog);

    // Step 2: Delete the created blog
    const deletedBlog = await deleteById(createdBlog._id);
    console.log("Deleted Blog:", deletedBlog);

    // Step 4: Check the deletedCount property
    console.log("Deleted Count:", deletedBlog?.deletedCount);

    // Step 5: Assertion
    expect(deletedBlog?.deletedCount).toBe(1);
  });
});