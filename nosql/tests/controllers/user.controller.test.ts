import common from "../common";
import model from "../../modules/users/user.model";
import { getById, get, create } from "../../modules/users/user.controller";
import bcrypt from "bcrypt";

// Mocking bcrypt.hash function to return "hashedPassword"
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));

describe("Auth /users", () => {
  jest.mock("../../modules/users/user.model", () => ({
    create: jest.fn().mockResolvedValue({
      /* mock data returned by create */
    }),
    findOne: jest.fn().mockResolvedValue(mockUsers[0]),
  }));

  const mockUsers = [
    {
      _id: "1",
      name: "User 1",
      email: "user1@example.com",
      password: "password1",
      isArchive: false,
      isActive: true,
    },
    {
      _id: "2",
      name: "User 2",
      email: "user2@example.com",
      password: "password2",
      isArchive: false,
      isActive: true,
    },
    {
      _id: "3",
      name: "User 3",
      email: "user3@example.com",
      password: "password3",
      isArchive: false,
      isActive: true,
    },
  ];

  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
  });

  describe("create", () => {
    it("should register user with hashed password", async () => {
      const payload = {
        name: "asim",
        email: "test@example.com",
        password: "password123",
        roles: "user",
      };

      const expectedResult = {
        _id: expect.any(String),
        name: "asim",
        email: payload.email,
        password: "hashedPassword",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };

      const result = await create(payload);
      console.log(result, "======");

      // Asserting that bcrypt.hash was called with the password
      expect(bcrypt.hash).toHaveBeenCalledWith(
        payload.password,
        expect.any(Number)
      );
      expect(result?.password).toEqual(expectedResult.password);
      expect(result?.email).toEqual(expectedResult.email);
    });
  });

  describe("getById", () => {
    it("should find and return a user by id", async () => {
      jest.spyOn(model, "findOne").mockResolvedValue(mockUsers[0]);
      const result = await getById(mockUsers[0]._id);
      expect(model.findOne).toHaveBeenCalledWith({ _id: mockUsers[0]._id });
      expect(result).toEqual(mockUsers[0]);
    });
  });
});
