import bcrypt from "bcrypt";
import model from "./auth.model";
import userModel from "../users/user.model";

import { generateOTP, verifyOTP } from "../../utils/otp";
import { authData, verifyData } from "./auth.types";
import { mailer } from "../../services/mailer";

const register = async (payload: authData): Promise<unknown> => {
  try {
    const { isActive, isEmailVerified, roles, password, ...rest } = payload;
    rest.password = await bcrypt.hash(password, Number(process.env.SAL_ROUND));
    const user = await userModel.create(rest);
    const token = generateOTP();
    console.log(typeof token);
    await model.create({ email: user?.email, token });
    const mail = await mailer(user?.email, token);
    return mail;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // Rethrow the error for handling at a higher level if needed
  }
};
const verify = async (payload: verifyData): Promise<unknown> => {
  const {email,token} = payload
  const auth = await model.findOne({email});
  if (!auth) throw new Error("User is not available");

  const isValidToken = await verifyOTP(token);
  if (!isValidToken) throw new Error("Token Expired");

  const emailValid = auth?.token === +token;
  if (!emailValid) throw new Error("Token mismatch");

  const user = await userModel.findOneAndUpdate(
    { email},
    { isEmailVerified: true, isActive: true },
    { new: true }
  ).select("-password");
  await model.deleteOne({ email });
  return user
};

export default {
  register,
  verify,
};
