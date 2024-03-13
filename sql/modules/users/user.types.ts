import { Document } from "mongoose";

export interface BaseData extends Document {
  data: {}
  id?: string;
  name: string;
  email: string;
  password: string;
  images?: string;
  isEmailVerified: boolean;
  isActive?: boolean;
  roles?: string[];
  isArchive?: boolean;
  created_by?: string;
  updated_by?: string;
  select?: string;
  currentUser?: string;
  currentRoles?: string;
  
}

export interface payloadTypes extends   BaseData {
 
}

