import { Document } from "mongoose";
import { z } from "zod";
import { registerValidator } from "../auth/auth.validator";


export type authData = z.infer<typeof registerValidator> & Document;
