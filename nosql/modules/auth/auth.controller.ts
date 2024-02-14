import bcrypt from "bcrypt";
import model from './auth.model'
import userModel from "../users/user.model";

import {generateOTP} from "../../utils/otp"
import { authData } from './auth.types'
import {mailer} from '../../services/mailer';

const register = async (payload: authData): Promise<unknown> => {
  try {
    const { isActive, isEmailVerified,roles, password, ...rest } = payload;
    rest.password = await bcrypt.hash(password, Number(process.env.SAL_ROUND));
    const user = await userModel.create(rest);
    const token =  generateOTP();
    await model.create({ email: user?.email, token });
    const mail = await mailer(user?.email, token);
    return mail;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // Rethrow the error for handling at a higher level if needed
  }
};

export default {
  register
};
