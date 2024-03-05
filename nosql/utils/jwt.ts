import JWT from "jsonwebtoken";
import crypto from 'crypto'

const generateJWT = (payload: { [key: string]: any }) => {
  return JWT.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET || "",
    { expiresIn: process.env.JWT_DURATION }
  );
};

const verifyJWT = (token: string) => {
  try {
    return JWT.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error("Token is invalid");
  }
};
const generateRandomToken = () => {
  return crypto.randomInt(100000, 999999);
};
export  { generateJWT, verifyJWT,generateRandomToken };
