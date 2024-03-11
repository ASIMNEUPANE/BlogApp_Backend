import bcrypt from "bcrypt";
import prisma from "../../DB/db.config";

import { generateOTP, verifyOTP } from "../../utils/otp";
import { verifyData, UserLogin } from "./auth.types";
import { BaseData } from "../users/user.types";
import { mailer } from "../../services/mailer";
import { generateJWT } from "../../utils/jwt";

const register = async (payload: BaseData): Promise<boolean> => {
  let { isActive, isEmailVerified, roles, password, ...rest } = payload as {
    password: string;
    [key: string]: any;
  };
  rest.password = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
  const user = await prisma.user.create({ data: rest });
  const token = generateOTP();
  const authUSer = { email: user.email, token: token };
  await prisma.auth.create({ data: authUSer });
  await mailer(user?.email, token);
  return true;
};
const verify = async (payload: verifyData): Promise<boolean> => {
  const { email, token } = payload;
  const auth = await prisma.auth.findUnique({ where: { email: email } });
  if (!auth) throw new Error("User is not available");
  const isValidToken = await verifyOTP(token);
  if (!isValidToken) throw new Error("Token Expired");
  const emailValid = auth?.token === token;
  if (!emailValid) throw new Error("Token mismatch");

  const user = await prisma.user.updateMany({
    where: { email: email },
    data: { isEmailVerified: true, isActive: true },
  });

  await prisma.auth.delete({ where: { email: email } });
  return true;
};

const regenerateToken = async (email: string): Promise<Boolean> => {
  const auth = await prisma.auth.findUnique({ where: { email: email } });
  if (!auth) throw new Error("User not found");

  const newToken = generateOTP();
  await prisma.auth.update({
    where: { email },
    data: { token: newToken },
  });
  await mailer(email, +newToken);
  return true;
};

const login = async (email: string, password: string): Promise<UserLogin> => {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user);
  if (!user) throw new Error("User not found");
  if (!user?.isEmailVerified) throw new Error("Email is not verified yet");
  if (!user?.isActive)
    throw new Error("User is not active. Please contact admin");
  const isValidPw = await bcrypt.compare(password, user?.password);
  if (!isValidPw) throw new Error("User or password invalid");
  const payload = {
    id: user?.id,
    email: user?.email,
    roles: user?.roles,
  };
  const token = generateJWT(payload);
  return {
    user: { name: user.name, roles: user.roles, email: user.email },
    token,
  };
};

const generateFPToken = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
      isArchive: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = generateOTP();
  let auth = await prisma.auth.findUnique({ where: { email } });

  if (auth) {
    // If the auth entry exists, update the token
    await prisma.auth.update({ 
      where: { email },
      data: { token }
    });
  } else {
    // If the auth entry doesn't exist, create a new one
    await prisma.auth.create({ data: { email, token } });
  }

  await mailer(email, token);
  return true;
};


const forgetPassowrd = async (
  email: string,
  token: string,
  password: string
): Promise<boolean> => {
  const auth = await prisma.auth.findUnique({ where: { email } });
  if (!auth) throw new Error("user not found");
  const isValidToken = await verifyOTP(token);
  if (!isValidToken) throw new Error("Token expire");
  const emailValid = auth?.token === token;
  if (!emailValid) throw new Error("Token mismatch");
  await prisma.user.updateMany({
    where: { email },
    data: {
      password: await bcrypt.hash(password, +process.env.SALT_ROUND),
    },
  });
  await prisma.auth.delete({ where: { email } });
  return true;
};

export {
  register,
  verify,
  regenerateToken,
  login,
  generateFPToken,
  forgetPassowrd,
};
