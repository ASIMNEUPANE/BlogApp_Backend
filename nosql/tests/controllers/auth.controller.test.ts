import common from "../common";
import userModel from "../../modules/users/user.model";
import authModel from "../../modules/auth/auth.model";
import { register, verify } from "../../modules/auth/auth.controller";
import bcrypt from "bcrypt";
import { totp } from "otplib";
import nodemailer from "nodemailer";
import JWT from "jsonwebtoken";
import { verifyOTP } from "../../utils/otp";

// Mocking bcrypt.hash function to return "hashedPassword"
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

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
});
