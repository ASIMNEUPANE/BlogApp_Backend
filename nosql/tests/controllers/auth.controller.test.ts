import bcrypt from "bcrypt";
import userModel from "../../modules/users/user.model";
import { generateOTP } from "../../utils/otp";
import { register, verify } from "../../modules/auth/auth.controller";
import * as authModel from "../../modules/auth/auth.controller";
import { mailer } from "../../services/mailer";
import common from "../common"; 

jest.mock("../../modules/auth/auth.controller", () => {
  const originalModule = jest.requireActual(
    "../../modules/auth/auth.controller"
  );
  jest.mock("../../utils/otp", () => ({
    generateOTP: jest.fn(),
  }));
  jest.mock("../../services/mailer", () => ({
    mailer: jest.fn(),
  }));
  jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword"),
  }));
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

jest.mock("../../utils/otp", () => ({
  ...jest.requireActual("../../utils/otp"),
  verifyOTP: jest.fn().mockReturnValue(true),
}));

describe("User controller Test - Register", () => {
  beforeAll(async () => {
    await common.connectDatabase();
  });

  afterAll(async () => {
    await common.closeDatabase();
    jest.clearAllMocks();

  });

  it("should register a user", async () => {
    const userData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "Password456",
      images: "avatar.jpg",
      // token: "123456",
    };

    // bcrypt.hash.mockResolvedValue("hashedPassword");
    userModel.create.mockResolvedValue({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "hashedPassword",
      images: "avatar.jpg",
    });

    generateOTP.mockReturnValue("123456");
    mailer.mockResolvedValue(true);

    const result = await register(userData);

    expect(result).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith(
      userData.password,
      expect.any(Number)
    );
    expect(userModel.create).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email,
      password: "hashedPassword",
      images: userData.images,
    });
    expect(generateOTP).toHaveBeenCalled();
    expect(mailer).toHaveBeenCalledWith(userData.email, "123456");
  });
});

describe("User controller Test - Verify", () => {
  it("verify user", async () => {
    const userData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "Password456",
      images: "avatar.jpg",
      token: "123456",
    };

    await register(userData);

    const otp = generateOTP();

    authModel.verify.mockReturnValue(true);

    const result = await verify({
      email: userData.email,
      token: otp,
    });

    expect(result).toBe(true);
    expect(authModel.verify).toHaveBeenCalledWith({
      email: userData.email,
      token: otp,
    });
  });
});
