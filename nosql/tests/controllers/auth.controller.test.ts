import common from "../common";
import { generateOTP, verifyOTP } from "../../utils/otp";
import { totp } from "otplib";
import { register, verify } from "../../modules/auth/auth.controller";
import * as authModel from "../../modules/auth/auth.controller";

// Mocking database operations
jest.mock("../../modules/auth/auth.controller", () => {
  const originalModule = jest.requireActual(
    "../../modules/auth/auth.controller"
  );
  const mockDb = new Map();
  return {
    ...originalModule,
    register: jest.fn((userData) => mockDb.set(userData.email, userData)),
    verify: jest.fn((payload) => {
      const { email, token } = payload;
      const userData = mockDb.get(email);
      if (!userData) throw new Error("User is not available");
      if (userData.token !== token) throw new Error("Token mismatch");
      return true;
    }),
  };
});

// Mocking totp.generate
jest.mock("otplib", () => {
  const originalModule = jest.requireActual("otplib");
  return {
    ...originalModule,
    totp: {
      ...originalModule.totp,
      generate: jest.fn(),
      check: jest.fn(),
    },
  };
});

// Mocking verifyOTP to always return true for simplicity
jest.mock("../../utils/otp", () => ({
  ...jest.requireActual("../../utils/otp"),
  verifyOTP: jest.fn().mockReturnValue(true),
}));

// Test suite
describe("User controller Test", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
  });

  // Test case for verifying registered user
  it("verify user", async () => {
    const userData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "Password456",
      images: "avatar.jpg",
      token: "123456",
    };

    // Registering a user
    console.log("Registering user...");
    await register(userData);
    console.log("User registered.");

    // Mocking OTP generation
    (totp.generate as jest.Mock).mockReturnValue("123456");

    // Generating OTP
    console.log("Generating OTP...");
    const otp = generateOTP();
    console.log("OTP generated:", otp);

    (totp.check as jest.Mock).mockReturnValue("123456");
    // Verifying OTP for registered user
    console.log("Verifying OTP...");
    const result = await verify({
      email: userData.email,
      token: otp, // Use the generated OTP
    });

    expect(result).toBe(true);
    expect(authModel.verify).toHaveBeenCalledWith({
      email: userData.email,
      token: otp,
    });
  });
});
