import {totp} from "otplib";

totp.options = { digits: 6, step: Number(process.env.OTP_DURATION) };
require("dotenv").config();

export const generateOTP = () => {
  totp.options = { digits: 6, step: 120 };
  return totp.generate(process.env.OTP_SECRET);
};

export const verifyOTP = async (token:string) => {
  totp.options = { digits: 6, step: 120 };
  const x = totp.check(token, process.env.OTP_SECRET);
  return x;
};



