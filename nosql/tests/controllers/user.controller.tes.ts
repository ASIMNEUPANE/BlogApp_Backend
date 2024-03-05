import common from "../common";
import model from "../../modules/users/user.model";
import {
  getById,
  get,
  create,
  updateById,
  changePassword,
  resetPassword,
  block,
  archive,
} from "../../modules/users/user.controller";
import * as controller from "../../modules/users/user.controller";
import bcrypt from "bcrypt";

// Mocking bcrypt.hash function to return "hashedPassword"
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));
const mockAggregate = jest.fn();

describe("Users", () => {
  jest.mock("../../modules/users/user.model", () => ({
    create: jest.fn().mockResolvedValue({
      /* mock data returned by create */
    }),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn().mockResolvedValue(true),
    changePassword: jest.fn(),
    resetPassword: jest.fn(),
    block: jest.fn(),
    aggregate: mockAggregate,
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
      // @ts-ignore
      
      const result = await create(payload);
      
      // Asserting that bcrypt.hash was called with the password
      expect(bcrypt.hash).toHaveBeenCalledWith(
        payload.password,
        expect.any(Number)
        );
        
        expect(result?.password).toEqual(expectedResult.password);
        expect(result?.email).toEqual(expectedResult.email);
        expect(result?.password).toEqual(expectedResult.password);
      });
    });
    describe("getALL", () => {
      it("should return paginated data", async () => {
       
    });
  })
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
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUsers[0]._id },
        { name: "newName" },
        { new: true }
      );
      expect(result?.name).toEqual("newName");
    });
  });
  describe("changePassword", () => {
    it("should change the password", async () => {
      // Mock initial user data
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "prevHash",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };
      jest.spyOn(model, "findOne").mockResolvedValue(initialUserData);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue({
        ...initialUserData,
        password: "hashedPassword",
      });

      // Call the changePassword function

      const result = await changePassword(
        initialUserData._id, // User ID
        "helloworld", // Old password
        "hellobuddy" // New password}
      );
      expect(result?.password).toEqual("hashedPassword");
      expect(model.findOne).toHaveBeenCalledWith({ _id: initialUserData._id });
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: initialUserData._id },
        { password: "hashedPassword" },
        { new: true }
      );
      expect(bcrypt.compare).toHaveBeenCalledWith("helloworld", "prevHash");
      expect(bcrypt.hash).toHaveBeenCalledWith(
        "hellobuddy",
        expect.any(Number)
      );
    });

    it("should throw an error if old password is incorrect", async () => {
      // Mock initial user data
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "prevHash",
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
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "incorrectOldPassword",
        "prevHash"
      );
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

      expect(model.findOne).toHaveBeenCalledWith({ _id: "nonExistingUserId" });
      expect(model.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });
  describe("resetPassword", () => {
    it("should reset the password", async () => {
      // Mock initial user data
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "prevHash",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };
      jest.spyOn(model, "findOne").mockResolvedValue(initialUserData);

      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue({
        ...initialUserData,
        password: "hashedPassword",
      });

      // Call the changePassword function

      const result = await resetPassword(
        initialUserData._id, // User ID
        "helloworld"
        // New password}
      );
      expect(result?.password).toEqual("hashedPassword");
      expect(model.findOne).toHaveBeenCalledWith({ _id: initialUserData._id });
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: initialUserData._id },
        { password: "hashedPassword" },
        { new: true }
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(
        "helloworld",
        expect.any(Number)
      );
    });
    it("should throw error if user not found ", async () => {
      jest.spyOn(model, "findOne").mockResolvedValue(null);

      await expect(
        resetPassword(
          "nonExistingUserId", // Non-existing user ID
          "oldPassword"
        )
      ).rejects.toThrow("User not found");
      expect(model.findOne).toHaveBeenCalledWith({ _id: "nonExistingUserId" });
    });
  });
  describe("block", () => {
    it("should block the user", async () => {
      const initialUserData = {
        _id: "1231n3123n13",
        name: "asim",
        email: "asimneupane",
        password: "prevHash",
        roles: ["user"],
        isEmailVerified: true,
        isActive: true,
      };

      jest.spyOn(model, "findOne").mockResolvedValue(initialUserData);

      // Mock findOneAndUpdate to return the updated user
      const updatedUser = {
        ...initialUserData,
        isActive: false,
      };
      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue(updatedUser);

      // Call block function
      const payload = {
        isActive: false,
      };
      const result = await block(initialUserData._id, payload);

      // Assert that findOneAndUpdate was called with the correct parameters
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: initialUserData._id },
        payload,
        { new: true }
      );
      expect(model.findOne).toHaveBeenCalledWith({ _id: initialUserData._id });

      // Assert that the result contains the updated user
      expect(result?.isActive).toEqual(false);
    });
    it("should throw an error if user not found", async () => {
      jest.spyOn(model, "findOne").mockResolvedValue(null);
      const payload = {
        isActive: false,
      };
      await expect(block("12c134d324dx42", payload)).rejects.toThrow(
        "User not found"
      );

      // Assert that findOneAndUpdate was not called

      expect(model.findOneAndUpdate).not.toHaveBeenCalled();
      expect(model.findOne).toHaveBeenCalledWith({ _id: "12c134d324dx42" });
    });
  });
  describe("Archive", () => {
    it("should archive the user", async () => {
      const mockUser = {
        _id: "1",
        name: "User 1",
        email: "user1@example.com",
        password: "password1",
        isArchive: false,
        isActive: true,
      };
      jest.spyOn(model, "findOne").mockResolvedValue(mockUser);

      // Mock findOneAndUpdate to return the updated user
      const updatedUser = {
        ...mockUser,
        isArchive: true,
      };
      jest.spyOn(model, "findOneAndUpdate").mockResolvedValue(updatedUser);

      // Call block function
      const payload = {
        isArchive: true,
      };
      const result = await archive(mockUser._id, payload);
      // Assert that findOneAndUpdate was called with the correct parameters
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id },
        payload,
        { new: true }
      );

      // Assert that the result contains the updated user
      expect(result?.isArchive).toEqual(true);
      expect(model.findOne).toHaveBeenCalledWith({ _id: mockUser._id });
    });
    it("should throw and error if user is not found", async () => {
      jest.spyOn(model, "findOne").mockResolvedValue(null);
      const payload = {
        isArchive: true,
      };
      await expect(archive("12321j3h2432j", payload)).rejects.toThrow(
        "User not found"
      );
      expect(model.findOne).toHaveBeenCalledWith({ _id: "12321j3h2432j" });
    });
  });

})