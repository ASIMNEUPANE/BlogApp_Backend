//  userController

import userModel from "../../modules/users/user.model";
import authModel from "../../modules/auth/auth.model";
import { register, verify } from "../../modules/auth/auth.controller";
import { hashPassword } from "../../utils/bcrypt";
import { mailer } from "../../services/mailer";
import { generateJWT, verifyJWT, generateRandomToken } from "../../utils/jwt";
import * as OTP from "../../utils/otp";
import common from "../common";
import bcrypt from "bcrypt";

// import bcrypt from "bcrypt";

jest.mock("../../utils/otp", () => ({
  generateOTP: jest.fn(() => "123456"),
  verifyOTP: jest.fn(),
  // generateRandomToken: jest.fn(() => "123456"),
}));

jest.mock("../../services/mailer", () => ({
  mailer: jest.fn(
    () => "<info>@mail.com<d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>"
  ),
}));

jest.spyOn(userModel, "create");
jest.spyOn(userModel, "findOne");
jest.spyOn(userModel, "updateOne");

jest.spyOn(authModel, "create");
jest.spyOn(authModel, "findOne");
jest.spyOn(authModel, "updateOne");

describe("User Registration Testing", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
  });
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });
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
    jest.spyOn(OTP, "generateOTP").mockReturnValue("123456");

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
    expect(OTP.generateOTP).toHaveBeenCalled();
    // Check if authModel.create was called
    const authPayload = {
      email: payload.email,
      token: "123456",
    };
    jest.spyOn(authModel, "create").mockResolvedValue(authPayload);

    // Check if nodemailer.createTransport().sendMail was called
    expect(mailer).toHaveBeenCalled();
    expect(authModel.create).toHaveBeenCalledWith(authPayload);
    // Assert the result returned by register function
    expect(result).toEqual(true);
    // expect(result.password).toEqual("hashedPassword");
    expect(mailer).toHaveBeenCalledWith("asimneupane11@gmail.com", 123456);
  });
});
describe("User verification Testing", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
  });
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });
  it("should verify the user", async () => {
    const payload = {
      name: "asim neupane",
      email: "asimneupane11@gmail.com",
      password: "helloworld",
      images: "asim.jpg",
    };

    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
    // Mocking userModel.create function
    jest.spyOn(userModel, "create").mockResolvedValue(payload);

    // Mocking totp.generate function

    jest.spyOn(OTP, "generateOTP").mockReturnValueOnce("123456");
    const authPayload = {
      email: payload.email,
      token: "123456",
    };
    jest.spyOn(authModel, "create").mockResolvedValue(authPayload);

    // Call the register function
    await register(payload);

    jest
      .spyOn(authModel, "findOne")
      .mockResolvedValue({ email: authPayload.email, token: "123456" });

    jest.spyOn(OTP, "verifyOTP").mockReturnValue("123456");
    jest
      .spyOn(userModel, "findOneAndUpdate")
      .mockResolvedValue(
        { email: payload.email },
        { isEmailVerified: true, isActive: true },
        { new: true }
      );

    const result = await verify(authPayload);
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: payload.email },
      { isEmailVerified: true, isActive: true },
      { new: true }
    );
    expect(userModel.create).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      password: "hashedPassword",
      images: payload.images,
    });
    expect(OTP.generateOTP).toHaveBeenCalled();
    expect(OTP.verifyOTP).toHaveBeenCalledWith("123456");
    expect(bcrypt.hash).toHaveBeenCalledWith(
      payload.password,
      expect.any(Number)
    );
    expect(authModel.create).toHaveBeenCalledWith(authPayload);
    expect(authModel.findOne).toHaveBeenCalledWith({
      email: authPayload.email,
    });
    expect(result).toBe(true);
  });
  it("should throw an error if user is not available", async () => {
    // Mock payload with invalid email
    const payload = {
      email: "invalidtest@example.com",
      token: "Token", // Provide an incorrect token
    };

    // Mock authModel.findOne to return null, simulating user not found
    jest.spyOn(authModel, "findOne").mockResolvedValue(null);

    // Call the verify function with the payload
    const verificationProcess = verify(payload);

    // Assertion: Ensure that authModel.findOne is called with the correct parameters
    expect(authModel.findOne).toHaveBeenCalledWith({ email: payload.email });

    // Assertion: Ensure that the function throws an error with the correct message
    await expect(verificationProcess).rejects.toThrow("User is not available");
  });
  it("should throw an error if token is expired", async () => {
    // Mock payload with valid email but invalid token (expired)
    const payload = {
      email: "validtest@example.com",
      token: "ExpiredToken",
    };

    // Mock authModel.findOne to return a user
    jest
      .spyOn(authModel, "findOne")
      .mockResolvedValue({ email: payload.email, token: payload.token });

    // Mock verifyOTP to return false, simulating token expiration
    jest.spyOn(OTP, "verifyOTP").mockResolvedValue(false);

    // Call the verify function with the payload
    const verificationProcess = verify(payload);

    // Assertion: Ensure that the function throws an error with the correct message
    await expect(verificationProcess).rejects.toThrow("Token Expired");
    expect(OTP.verifyOTP).toHaveBeenCalledWith(payload.token);
    expect(authModel.findOne).toHaveBeenCalledWith({ email: payload.email });
  });
  it("should throw an error if token is missmatch", async () => {
    // Mock payload with valid email but invalid token (expired)
    const payload = {
      email: "validtest@example.com",
      token: "ExpiredToken",
    };

    // Mock authModel.findOne to return a user
    jest
      .spyOn(authModel, "findOne")
      .mockResolvedValue({ email: payload.email });

    // Mock verifyOTP to return false, simulating token expiration
    jest.spyOn(OTP, "verifyOTP").mockResolvedValue(true);

    // Call the verify function with the payload
    const verificationProcess = verify(payload);

    // Assertion: Ensure that the function throws an error with the correct message
    await expect(verificationProcess).rejects.toThrow("Token mismatch");
    expect(OTP.verifyOTP).toHaveBeenCalledWith(payload.token);
    expect(authModel.findOne).toHaveBeenCalledWith({ email: payload.email });
  });
});
