import common from "../common";
import User from "../../modules/users/user.model";
import Auth from "../../modules/auth/auth.model";
import * as controller from "../../modules/auth/auth.controller";
import bcrypt from "bcrypt";
import * as OTP from "../../utils/otp";
import * as mailer from "../../services/mailer";
import mongoose from "mongoose";
import authModel from "../../modules/auth/auth.model";

// Mocking nodemailer.createTransport().sendMail function
describe("auth", () => {
  beforeAll(async () => {
    await common.connectDatabase();
    const user = new User({
      _id: "65cef6c9792d3462e60cdfb9",
      name: "asim neupane",
      email: "asimneupane11@gmail.com",
      isEmailVerified: false,
      password: "$2b$10$.q7KID5.uHfXW7O8n.WgleeVjmc9KNlSmK51zv06brA9mLZIjKpE2",
      roles: ["user"],
      images: "asim.jpg",
      isActive: false,
      isArchive: false,
      createdAt: new Date("2024-02-16T05:51:16.592Z"),
      updatedAt: new Date("2024-02-16T05:51:16.592Z"),
      __v: 0,
    });
    const auth = new Auth({
      _id: "65cef6c9792d3462e60cd10f",
      email: "mock@gmail.com",
      token: 123456,
    });
  });

  afterAll(async () => {
    await common.closeDatabase();
    jest.clearAllMocks();
  });

  describe("Register a user", () => {
    it("should register the user", async () => {
      const mockUser = {
        name: "mockuser",
        email: "mock@gmail.com",
        password: "mockpassword",
      };
      jest
        .spyOn(bcrypt, "hash")
        .mockResolvedValue(
          "$2b$10$.q7KID5.uHfXW7O8n.WgleeVjmc9KNlSmK51zv06brA"
        );
      jest.spyOn(OTP, "generateOTP").mockReturnValue(123456);
      jest.spyOn(mailer, "mailer").mockResolvedValue(true);
      await controller.register(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockUser.password,
        expect.any(Number)
      );
      expect(OTP.generateOTP).toHaveBeenCalled();
      expect(mailer.mailer).toHaveBeenCalledWith(mockUser.email, 123456);
    });
  });
  describe("verify a user", () => {
    it("should verify the user", async () => {
      jest.spyOn(OTP, "verifyOTP").mockResolvedValue(123456);
      const payload = {
        email: "mock@gmail.com",
        token: 123456,
      };
      const result = await controller.verify(payload);
      expect(OTP.verifyOTP).toHaveBeenCalledWith(payload.token);
      expect(result.isActive).toBe(true);
      expect(result.isEmailVerified).toBe(true);
    });
    it("should throw an error if user not found", async () => {
      const payload = {
        email: "fakemock@gmail.com",
        token: 123456,
      };
      await expect(controller.verify(payload)).rejects.toThrow(
        "User is not available"
      );
    });
    it("should throw an error if Token Expired", async () => {
      jest.spyOn(OTP, "verifyOTP").mockResolvedValue(123456);
      const payload = {
        email: "mock@gmail.com",
        token: 123456,
      };
      await expect(controller.verify(payload)).rejects.toThrow(
        "Token Expired"
      );      expect(OTP.verifyOTP).toHaveBeenCalledWith(payload.token);
     
    });
  });
});
