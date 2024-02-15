import { Document } from "mongoose";
import { z } from "zod";
import { registerValidator } from "../auth/auth.validator";


// export type authData = z.infer<typeof registerValidator> & Document;
export interface authData extends Document {
    _id?:string,
    name: string;
    email: string;
    password: string;
    images: string;
    isEmailVerified: boolean;
    isActive: boolean;
    roles: Array<string>; // Specify the type argument for the Array type.
}

export interface Update {
    id: string
    data :any
}
export type UpdatePayload ={
    id?:string,
    name: string;
    email: string;
    password: string;
    images: string;
}

export type resetPayload ={
    id:string,
    password:string,
}
export type blockPayload ={
    isActive:boolean
}

export type deletePayload ={
    isArchive : boolean
}
