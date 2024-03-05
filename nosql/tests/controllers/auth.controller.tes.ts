//  userController
import userModel from "../../modules/users/user.model";
import authModel from "../../modules/auth/auth.model";
import {
  register,
  verify,
  regenerateToken,
  login,
  generateFPToken,
  forgetPassowrd,
} from "../../modules/auth/auth.controller";
import { mailer } from "../../services/mailer";
import * as OTP from "../../utils/otp";
import * as JWT from "../../utils/jwt";
import common from "../common";
import bcrypt from "bcrypt";

// import bcrypt from "bcrypt";

jest.mock("../../utils/otp", () => ({
  generateOTP: jest.fn(() => "123456"),
  verifyOTP: jest.fn(),
  // generateRandomToken: jest.fn(() => "123456"),
}));
jest.mock("../../utils/jwt", () => ({
  generateJWT: jest.fn().mockReturnValue("mockJWTtoken"),
  verifyJWT: jest.fn(),
}));

jest.mock("../../services/mailer", () => ({
  mailer: jest.fn(
    () => "<info>@mail.com<d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>"
  ),
}));

jest.spyOn(userModel, "create");
jest.spyOn(userModel, "findOne");
jest.spyOn(userModel, "findOneAndUpdate").mockResolvedValue(true);

jest.spyOn(authModel, "create");
jest.spyOn(authModel, "findOne");
jest.spyOn(authModel, "findOneAndUpdate").mockResolvedValue(true);

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

    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never );
    // Mocking userModel.create function
    jest.spyOn(userModel, "create").mockResolvedValue({
      name: payload.name ,
      email: payload.email,
      password: "hashedPassword",
      images: payload.images,
    })

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
describe("User regenerateToken Testing", () => {
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
  it("should regenarate a new OTP token", async () => {
    const authData = {
      email: "asimneupane11@gmail.com",
      token: "123456",
    };

    jest
      .spyOn(authModel, "findOne")
      .mockResolvedValue({ email: authData.email });

    jest.spyOn(OTP, "generateOTP").mockReturnValue("987654");
    jest
      .spyOn(authModel, "findOneAndUpdate")
      .mockResolvedValue({ email: authData.email, token: "987654" });

    await regenerateToken(authData.email);

    expect(authModel.findOne).toHaveBeenCalledWith({ email: authData.email });
    expect(authModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: authData.email },
      { token: "987654" },
      { new: true }
    );
    expect(OTP.generateOTP).toHaveBeenCalled();
  });
  it("should throw an error if user not found", async () => {
    jest.spyOn(authModel, "findOne").mockResolvedValue(false);
    await expect(regenerateToken("invalidemail@gmail.com")).rejects.toThrow(
      "User not found"
    );
    expect(authModel.findOne).toHaveBeenCalledWith({
      email: "invalidemail@gmail.com",
    });
  });
});
describe("user login ", () => {
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
      roles: mockUser?.roles || [],
    };

    jest.spyOn(userModel, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest.spyOn(JWT, "generateJWT").mockReturnValue("mockJWTtoken");
    await login(mockUser.email, "password");
    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
    expect(JWT.generateJWT).toHaveBeenCalledWith(mockPayload);
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
    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
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

    jest.spyOn(bcrypt, "compare").mockReturnValue(false);

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
    jest.spyOn(OTP, "generateOTP").mockReturnValue("123456");

    jest
      .spyOn(authModel, "create")
      .mockReturnValue({ email: mockUser.email, token: "123456" });

    const result = await generateFPToken(mockUser.email);
    expect(result).toBe(true);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: mockUser.email,
      isActive: true,
      isArchive: false,
    });
    expect(mailer).toHaveBeenCalledWith("asimneupane11@gmail.com", 123456);
    expect(OTP.generateOTP).toHaveBeenCalled();
    expect(authModel.create).toHaveBeenCalledWith({
      email: mockUser.email,
      token: "123456",
    });
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
    };
    const authMock = {
      email: "asimneupane11@gmail.com",
      token: "123456",
    };
    jest.spyOn(authModel, "findOne").mockResolvedValue(authMock);
    jest.spyOn(OTP, "verifyOTP").mockReturnValue("123456");

    jest.spyOn(bcrypt, "hash").mockReturnValue("NewhashedPassword");
    await forgetPassowrd(authMock.email, authMock.token, "newPassword");
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: mockUser.email },
      { password: "NewhashedPassword" },
      { new: true }
    );
    expect(OTP.verifyOTP).toHaveBeenCalledWith("123456");
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", expect.any(Number));
    expect(authModel.findOne).toHaveBeenCalledWith({ email: authMock.email });
  });
    it("should throw an error if user not found", async () => {
   
      const authMock = {
        email: "asimneupane11@gmail.com",
        token: "123456",
      };
      jest.spyOn(authModel, "findOne").mockResolvedValue(null);

      await expect(
        forgetPassowrd(authMock.email, authMock.token, "newPassword")
      ).rejects.toThrow("user not found");
      expect(authModel.findOne).toHaveBeenCalledWith({ email: authMock.email });

    });

  it("should throw an error if Token is expired", async () => {
    const authMock = {
      email: "asimneupane11@gmail.com",
      token: "123456",
    };
    jest.spyOn(authModel, "findOne").mockResolvedValue(true);

    jest.spyOn(bcrypt, "hash").mockResolvedValue("NewhashedPassword");
    jest.spyOn(OTP, 'verifyOTP').mockResolvedValue(false);

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

    jest.spyOn(OTP, 'verifyOTP').mockResolvedValue(true);

    await expect(
      forgetPassowrd(authMock.email, authMock.token, "newPassword")
    ).rejects.toThrow("Token mismatch");
    expect(OTP.verifyOTP).toHaveBeenCalledWith(authMock.token    )
    expect(authModel.findOne).toHaveBeenCalledWith({email:authMock.email})
  });
});
