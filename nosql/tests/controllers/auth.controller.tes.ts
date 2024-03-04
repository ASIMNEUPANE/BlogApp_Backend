import common from "../common";
import userModel from "../../modules/users/user.model";
import authModel from "../../modules/auth/auth.model";
import {
  login,
  regenerateToken,
  register,
  verify,
  generateFPToken,
  forgetPassowrd,
} from "../../modules/auth/auth.controller";
import bcrypt from "bcrypt";
import { totp } from "otplib";
import nodemailer from "nodemailer";
import JWT from "jsonwebtoken";
import * as otp from '../../utils/secure'



// Mocking nodemailer.createTransport().sendMail function
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

// Mocking authModel.create function
jest.mock("../../modules/auth/auth.model", () => ({
  create: jest.fn().mockResolvedValue(true),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn().mockResolvedValue(true),
  deleteOne: jest.fn().mockResolvedValue(true),
}));

// Mocking userModel.create function
jest.mock("../../modules/users/user.model", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn().mockResolvedValue(true),
}));

describe("Auth ", () => {
  jest.mock("../../modules/auth/auth.model", () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  }));
  beforeAll(async () => {

    await common.connectDatabase();

  });

  afterAll(async () => {
    await common.closeDatabase();
    jest.clearAllMocks();
  });

  describe("Register a user", () => {
    it("should register the user", async () => {
      // Define payload
      const payload = {
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "helloworld",
        images: "asim.jpg",
      };

      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
      // Mocking userModel.create function
      jest.spyOn(userModel, "create").mockResolvedValue({
        name: payload.name,
        email: payload.email,
        password: "hashedPassword",
        images: payload.images,
      });

      // Mocking totp.generate function
      jest.spyOn(totp, "generate").mockResolvedValue("12345");

      // Call the register function
      const result = await register(payload);

      // Assertions
      // Check if bcrypt.hash was called with the correct password
      expect(bcrypt.hash).toHaveBeenCalledWith(
        payload.password,
        expect.any(Number)
      );

      // Check if userModel.create was called with the expected user data
      expect(userModel.create).toHaveBeenCalledWith({
        name: payload.name,
        email: payload.email,
        password: "hashedPassword",
        images: payload.images,
      });

      // Check if totp.generate was called
      expect(totp.generate).toHaveBeenCalled();
      // Check if authModel.create was called
      const authPayload = {
        email: payload.email,
        token: "12345",
      };
      jest.spyOn(authModel, "create").mockResolvedValue(authPayload);

      // Check if nodemailer.createTransport().sendMail was called
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();

      // Assert the result returned by register function
      expect(result.email).toEqual("asimneupane11@gmail.com");
      expect(result.password).toEqual("hashedPassword");
    });
  });
  describe("verify a user", () => {
    it("should verify the user", async () => {
      const userData = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "Password456",
        images: "avatar.jpg",
        token: "123456",
      };

      jest.spyOn(authModel, "findOne").mockResolvedValue({
        email: userData.email,
        token: "123456",
      });

      jest.spyOn(totp, "check").mockResolvedValue(true);

      const result = await verify({
        email: userData.email,
        token: "123456",
      });

      expect(result).toBe(true);
      expect(totp.check).toHaveBeenCalledWith(userData.token, "Asim");

      expect(verify).toHaveBeenCalledWith({
        email: userData.email,
        token: "123456",
      });
    });
    it("should throw an error if user is not available ", async () => {
      const payload = {
        email: "invalidtest@example.com",
        token: "Token", // Provide an incorrect token
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(null);
      const verificationProcess = verify(payload);

      // Assertion: Ensure that the function throws an error with the correct message
      await expect(verificationProcess).rejects.toThrow(
        "User is not available"
      );
    });
    it("should throw an error if Token Expired ", async () => {
      const payload = {
        email: "test@example.com",
        token: "incorrectToken", // Provide an incorrect token
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(true);
      jest.spyOn(totp, "check").mockResolvedValue(false);
      const verificationProcess = verify(payload);
      await expect(verificationProcess).rejects.toThrow("Token Expired");
    });
    it("should throw an error if Token mismatch ", async () => {
      const payload = {
        email: "test@example.com",
        token: "incorrectToken", // Provide an incorrect token
      };

      // Mock the behavior of authModel.findOne to return a record with a different token
      jest.spyOn(authModel, "findOne").mockResolvedValue(
        true // Provide a token that does not match the payload
      );
      jest.spyOn(totp, "check").mockResolvedValue(true);

      // Execution: Call the verify function with the payload
      const verificationProcess = verify(payload);

      // Assertion: Ensure that the function throws an error with the correct message
      await expect(verificationProcess).rejects.toThrow("Token mismatch");

      // Also assert that the findOne method was called with the correct parameters
      expect(totp.check).toHaveBeenCalledWith(payload.token, "Asim");
      expect(authModel.findOne).toHaveBeenCalledWith({ email: payload.email });
    });
  });

  describe("regenerateToken", () => {
    it("should regenarate a new OTP token", async () => {
      const authData = {
        _id: "12h234u1h3",
        email: "asimneupane11@gmail.com",
        token: "123456",
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(authData);
      jest.spyOn(totp, "generate").mockResolvedValue("987654");

      await regenerateToken(authData.email);

      expect(authModel.findOne).toHaveBeenCalledWith({ email: authData.email });
      expect(authModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: authData.email },
        { token: "987654" },
        { new: true }
      );
      expect(totp.generate).toHaveBeenCalled();
    });
    it("should throw an error if user not found", async () => {
      const authData = {
        _id: "12h234u1h3",
        email: "asimneupane11@gmail.com",
        token: "123456",
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(false);
      await expect(regenerateToken("invalidemail@gmail.com")).rejects.toThrow(
        "User not found"
      );
    });
  });
  describe("login", () => {
    it("should login and give back a JWT token", async () => {
      const mockUser = {
        _id: "user_id",

        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
      };
      const mockPayload = {
        id: mockUser._id,
        email: mockUser.email,
        roles: mockUser.roles,
      };

      jest.spyOn(userModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      // jest.spyOn(userModel, "findOne").mockResolvedValue(payload);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(JWT, "sign").mockResolvedValue("generatedJWTToken");
      await login(mockUser.email, "password");
      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
      expect(JWT.sign).toHaveBeenCalledWith(
        {
          data: mockPayload,
        },
        "just-do-it",
        { expiresIn: "1d" }
      );
    });
    it("should throw an error if user not found", async () => {
      const mockUser = {
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
      };
      jest.spyOn(userModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(login(mockUser.email, mockUser.password)).rejects.toThrow(
        "User not found"
      );
    });
    it("should throw and error if user email is not verified", async () => {
      const mockUser = {
        _id: "user_id",
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: false,
      };

      jest.spyOn(userModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      await expect(login(mockUser.email, mockUser.password)).rejects.toThrow(
        "Email is not verified yet"
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });
    it("should throw and error if user is not active", async () => {
      const mockUser = {
        _id: "user_id",
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: false,
        isArchive: false,
        isEmailVerified: true,
      };

      jest.spyOn(userModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      await expect(login(mockUser.email, mockUser.password)).rejects.toThrow(
        "User is not active. Please contact admin"
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });
    it("should throw and error if user is not active", async () => {
      const mockUser = {
        _id: "user_id",
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
      };

      jest.spyOn(userModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(login(mockUser.email, mockUser.password)).rejects.toThrow(
        "User or password invalid"
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        mockUser.password
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });
  });
  describe("generateFPToken", () => {
    it("should generateFPToken ", async () => {
      const mockUser = {
        _id: "user_id",

        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
      };
      jest.spyOn(userModel, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(totp, "generate").mockResolvedValue("123456");

      jest
        .spyOn(authModel, "create")
        .mockReturnValue({ email: mockUser.email, token: "123456" });

      const result = await generateFPToken(mockUser.email);
      expect(result).toBe(true);

      jest
        .spyOn(nodemailer.createTransport(), "sendMail")
        .mockResolvedValue(mockUser.email, "123456");
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        isActive: true,
        isArchive: false,
      });
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
      expect(totp.generate).toHaveBeenCalled();
    });
    it("should throw an error if use not found", async () => {
      const mockUser = {
        _id: "user_id",

        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
      };
      jest.spyOn(userModel, "findOne").mockResolvedValue(null);
      await expect(generateFPToken(mockUser.email)).rejects.toThrow(
        "user not found"
      );
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        isActive: true,
        isArchive: false,
      });
    });
  });
  describe("forgetPassword", () => {
    it("should forget password", async () => {
      const mockUser = {
        _id: "user_id",
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
        // token: "123456"
      };
      jest.spyOn(totp, "generate").mockResolvedValue("123456");
      const authMock = {
        email: "asimneupane11@gmail.com",
        token: '123456',
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(authMock);
      jest.spyOn(totp, "check").mockResolvedValue("123456");

      jest.spyOn(bcrypt, "hash").mockResolvedValue("NewhashedPassword");

      jest.spyOn(userModel, "findOneAndUpdate").mockResolvedValue({
        email: mockUser.email,
        password: "NewhashedPassword",
        new: true,
      });
      await forgetPassowrd(
       authMock.email,
       authMock.token,
       'newPassword'
      );
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: mockUser.email },
        { password: "NewhashedPassword" },
        { new: true }
      );
    });
    it("should throw an error if user not found", async () => {
      const mockUser = {
        _id: "user_id",
        name: "asim neupane",
        email: "asimneupane11@gmail.com",
        password: "hashedPassword",
        images: "asim.jpg",
        roles: ["user"],
        isActive: true,
        isArchive: false,
        isEmailVerified: true,
        token: "123456",
      };
      const authMock = {
        email: "asimneupane11@gmail.com",
        token: "123456",
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(null);

      jest.spyOn(bcrypt, "hash").mockResolvedValue("NewhashedPassword");

      await expect(
        forgetPassowrd(authMock.email, authMock.token, "newPassword")
      ).rejects.toThrow("user not found");
    });

  it("should throw an error if Token is expired", async () => {
    const authMock = {
      email: "asimneupane11@gmail.com",
      token: "123456",
    };
    jest.spyOn(authModel, "findOne").mockResolvedValue(true);

    jest.spyOn(bcrypt, "hash").mockResolvedValue("NewhashedPassword");
    jest.spyOn(totp, "check").mockResolvedValue(false);

    await expect(
      forgetPassowrd(authMock.email, authMock.token, "newPassword")
    ).rejects.toThrow("Token expire");
  });
  it("should throw an error if token is mismatch", async () => {
    const authMock = {
      email: "asimneupane11@gmail.com",
      token: "123456",
    };
    jest.spyOn(authModel, "findOne").mockResolvedValue(true);

    jest.spyOn(bcrypt, "hash").mockResolvedValue("NewhashedPassword");
    jest.spyOn(totp, "check").mockResolvedValue(true);

    await expect(
      forgetPassowrd(authMock.email, authMock.token, "newPassword")
    ).rejects.toThrow("Token mismatch");
  });
});
})
