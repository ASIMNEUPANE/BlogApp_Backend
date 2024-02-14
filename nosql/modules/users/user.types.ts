import { Document } from "mongoose";
import { z } from "zod";
import { registerValidator } from "../auth/auth.validator";


// export type authData = z.infer<typeof registerValidator> & Document;
export interface authData extends Document {
    name: string;
    email: string;
    password: string;
    images: string;
    isEmailVerified: boolean;
    isActive: boolean;
    roles: Array<string>; // Specify the type argument for the Array type.
}
