import common from "../common";
import create from "../../modules/blog/blog.controller";

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

describe("blog Model Test", () => {
  beforeAll(async () => {
    console.log("Connecting to database...");
    await common.connectDatabase();
    console.log("Connected to database");
  });

  afterAll(async () => {
    console.log("Closing database connection...");
    await common.closeDatabase();
    console.log("Database connection closed");
  });

  // Add Operation
  it("create & save blog successfully", async () => {
    console.log("Creating blog...");
    const createdBlog = await create(blogData);
    console.log("Blog created:", createdBlog);
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
    expect(createdBlog.createdAt).toBeDefined();
  });

  // List Operation
  // Add your list operation test cases here
});
