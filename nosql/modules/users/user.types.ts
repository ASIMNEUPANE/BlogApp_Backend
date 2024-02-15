import { Document } from "mongoose";

export interface baseData extends Document {
  _id?: string;
  id: string;
  name: string;
  email: string;
  password: string;
  images: string;
  isEmailVerified: boolean;
  isActive: boolean;
  roles?: string[];
  isArchive:boolean
  
  // Specify the type argument for the Array type.
  // roles: Array<string>; // Specify the type argument for the Array type.
}


export interface payloadTypes extends baseData {}
