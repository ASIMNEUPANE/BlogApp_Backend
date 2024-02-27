import common from "../common";
import model from "../../modules/users/user.model";
import {
  getById,
  get,
  create,
  updateById,
  changePassword,
} from "../../modules/users/user.controller";
import * as controller from "../../modules/users/user.controller";
import bcrypt from "bcrypt";

// Mocking bcrypt.hash function to return "hashedPassword"
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

describe("Auth /users", () => {
  jest.mock("../../modules/users/user.model", () => ({
    create: jest.fn().mockResolvedValue({
      /* mock data returned by create */
    }),
    findOne: jest.fn().mockResolvedValue(mockUsers[0]),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockUsers[0]),
    changePassword: jest.fn().mockResolvedValue(mockUsers[0]),
    // changePassword: jest.fn().mockResolvedValue(mockUsers[0]),
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
    // @ts-ignore

    await common.closeDatabase();
    jest.clearAllMocks();
  });

  // describe("create", () => {
  //   it("should register user with hashed password", async () => {
  //     const payload = {
  //       name: "asim",
  //       email: "test@example.com",
  //       password: "password123",
  //       roles: "user",
  //     };

  //     const expectedResult = {
  //       _id: expect.any(String),
  //       name: "asim",
  //       email: payload.email,
  //       password: "hashedPassword",
  //       roles: ["user"],
  //       isEmailVerified: true,
  //       isActive: true,
  //     };
  //     // @ts-ignore

  //     const result = await create(payload);
  //     console.log(result, "======");

  //     // Asserting that bcrypt.hash was called with the password
  //     expect(bcrypt.hash).toHaveBeenCalledWith(
  //       payload.password,
  //       expect.any(Number)
  //     );

  //     expect(result?.password).toEqual(expectedResult.password);
  //     expect(result?.email).toEqual(expectedResult.email);
  //     expect(result?.password).toEqual(expectedResult.password);
  //   });
  // });

  describe("getById", () => {
    it("should find and return a user by id", async () => {
      jest.spyOn(model, "findOne").mockResolvedValue(mockUsers[0]);
      const result = await getById(mockUsers[0]._id);
      expect(model.findOne).toHaveBeenCalledWith({ _id: mockUsers[0]._id });
      expect(result).toEqual(mockUsers[0]);
    });
  });
  describe("updateById", () => {
    it("should find and update a user by id", async () => {
      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue({
        ...mockUsers[0],
        name: "newName",
      });
      const result = await updateById(
        mockUsers[0]._id,
        { name: "newName" },
        { new: true }
      );
      console.log(result, "=====");
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUsers[0]._id },
        { name: "newName" },
        { new: true }
      );
      expect(result.name).toEqual("newName");
    });
  });
  describe("changePassword", () => {
    // afterEach(() => {
    //   jest.clearAllMocks(); // Clear mock calls after each test
    // });

    it("should change the password", async () => {
      // Mock initial user data
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "helloworld",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };

      // Mock findOne and findOneAndUpdate methods
      jest.spyOn(model, "findOne").mockResolvedValue(initialUserData);
      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue({
        ...initialUserData,
        password: "hashedPassword",
      });

      // Call the changePassword function
      const result = await changePassword(
        initialUserData._id, // User ID
        "helloworld", // Old password
        "hellobuddy" // New password
      );
      // Assert that findOneAndUpdate was called with the correct parameters
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: initialUserData._id }, // Filter by user ID
        { password: "hashedPassword" }, // New hashed password
        { new: true } // Options
      );

      // Assert that the bcrypt hash function was called with the new password
      expect(bcrypt.hash).toHaveBeenCalledWith(
        "hellobuddy",
        expect.any(Number)
      );

      // Assert that the returned result contains the updated password
      expect(result?.password).toEqual("hashedPassword");
    });

    it("should throw an error if old password is incorrect", async () => {
      // Mock initial user data
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "helloworld",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      // Call the changePassword function
      await expect(
        changePassword(
          initialUserData._id, // User ID
          "incorrectOldPassword", // Incorrect old password
          "newPassword" // New password
        )
      ).rejects.toThrow("oldpassword is incorrect");
    });
    it("should throw an error if user not found", async () => {
      // Mock findOne method to return null (user not found)
      jest.spyOn(model, "findOne").mockResolvedValue(null);

      // Call the changePassword function
      await expect(
        changePassword(
          "nonExistingUserId", // Non-existing user ID
          "oldPassword", // Old password
          "newPassword" // New password
        )
      ).rejects.toThrow("User not found");

      expect(model.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });
});
