import { Document } from "mongoose";
import { z } from "zod";
import { registerValidator, verify } from "./auth.validator";

export interface Iauth extends Document {
  email: string;
  token: number;
  timestamps: Date;
}

export type UserLogin = {
  user: {
    name: string;
    roles?: string[];
    email: string;
  };
  token: string;
};

export type authData = z.infer<typeof registerValidator>;
export type verifyData = z.infer<typeof verify>;
