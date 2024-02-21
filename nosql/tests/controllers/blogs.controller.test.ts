import common from "../common";
import { create, get, getById } from "../../modules/blog/blog.controller";
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

const getData = {
  limit: 2,
  page: 1,
};

// Add Operation

describe("Blog Model Test", () => {
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

  it("lists all blogs", async () => {
    const allData = await get(2, 2, "");

   // Assertion to check if allData is an object
  expect(typeof allData).toBe('object');

  // Assertion to check if allData contains a property named 'data'
  expect(allData).toHaveProperty('data');

  // Assertion to check if 'data' property is an array
  expect(Array.isArray(allData.data)).toBe(true);

  // Assertion to check if each item in 'data' array is an object
  allData.data.forEach(item => {
    expect(typeof item).toBe('object');
  });
});

  // Get By Id Operation
  it("Get a blog by id",async()=>{
    const createdBlog = await create(blogData);
    const getData = await getById(createdBlog._id)
    expect(getData).toBeDefined();
    expect(getData.title).toBe(getData.title)
  })
} 
)