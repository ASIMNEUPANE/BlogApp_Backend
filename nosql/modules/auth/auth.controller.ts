import bcrypt from "bcrypt";
import model from "./auth.model";
import userModel from "../users/user.model";

import { generateOTP, verifyOTP } from "../../utils/otp";
import { verifyData, UserLogin } from "./auth.types";
import { authData } from "../users/user.types";
import { mailer } from "../../services/mailer";
import { generateJWT } from "../../utils/jwt";
import { DeleteResult } from "../blog/blog.type";

const register = async (payload: authData): Promise<string> => {
  try {
    const { isActive, isEmailVerified, roles, password, ...rest } = payload;
    rest.password = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    const user = await userModel.create(rest);
    const token = generateOTP();
    await model.create({ email: user?.email, token });
    return await mailer(user?.email, +token);
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // Rethrow the error for handling at a higher level if needed
  }
};
const verify = async (payload: verifyData): Promise<boolean> => {
  const { email, token } = payload;
  const auth = await model.findOne({ email });
  if (!auth) throw new Error("User is not available");
  const isValidToken = await verifyOTP(token);

  if (!isValidToken) throw new Error("Token Expired");

  const emailValid = auth?.token === +token;
  if (!emailValid) throw new Error("Token mismatch");

  await userModel
    .findOneAndUpdate(
      { email },
      { isEmailVerified: true, isActive: true },
      { new: true }
    )
    .select("-password");
  await model.deleteOne({ email });
  return true;
};

const regenerateToken = async (email: string): Promise<Boolean> => {
  console.log(email, "email");
  const auth = await model.findOne({ email });
  console.log(auth);
  if (!auth) throw new Error("User not found");

  const newToken = generateOTP();
  await model.findOneAndUpdate({ email }, { token: +newToken }, { new: true });
  await mailer(email, +newToken);
  return true;
};

const login = async (email: string, password: string): Promise<UserLogin> => {
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("User not found");
  if (!user?.isEmailVerified) throw new Error("Email is not verified yet");
  if (!user?.isActive)
    throw new Error("User is not active. Please contact admin");
  const isValidPw = await bcrypt.compare(password, user?.password);
  if (!isValidPw) throw new Error("User or password invalid");
  const payload = {
    id: user?._id,
    email: user?.email,
    roles: user?.roles || [],
  };
  const token = generateJWT(payload);
  return {
    user: { name: user.name, roles: user.roles, email: user.email },
    token,
  };
};

const generateFPToken = async (email: string): Promise<boolean> => {
  const user = await userModel.findOne({
    email,
    isActive: true,
    isArchive: false,
  });
  if (!user) throw new Error("user not found");
  const token = generateOTP();
  await model.create({ email, token });
  await mailer(email, +token);
  return true;
};

const forgetPassowrd = async (
  email: string,
  token: string,
  password: string
): Promise<DeleteResult> => {
  const auth = await model.findOne({ email });
  if (!auth) throw new Error("user not found");
  const isValidToken = await verifyOTP(token);
  if (!isValidToken) throw new Error("Token expire");
  const emailValid = auth?.token === +token;
  if (!emailValid) throw new Error("Token mismatch");
  await userModel.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, +process.env.SALT_ROUND) },

    { new: true }
  );
  return await model.deleteOne({ email });
};

export default {
  register,
  verify,
  regenerateToken,
  login,
  generateFPToken,
  forgetPassowrd,
};
