import common from "../common";
import { create, get } from "../../modules/blog/blog.controller";
import MongoClient from "mongodb";

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

const getData = {
  limit: 2,
  page: 1,
};

// Add Operation

describe("Blog Model Test", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

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
    expect(createdBlog.updatedAt).toBeDefined();
  });
  // List Operation

  it("lists all todos with their subtasks", async () => {
    const allData = await get(2, 2, "");

    expect(allData).toBeDefined();
    expect(Array.isArray(allData)).toBe(true);
  });

  // List Operation
  // Add your list operation test cases here
});
