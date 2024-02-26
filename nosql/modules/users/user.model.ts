import { Schema, model } from "mongoose";
import { BaseData } from "./user.types";
const userSchema = new Schema<BaseData>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
    },
    isEmailVerified: { type: Boolean, default: false },

    password: { type: String },
    roles: {
      type: Array,
      // enum: ["user", "admin"],
      default: ["user"],
    },
    images: { type: String },

    isActive: { type: Boolean, default: false },
    
    isArchive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("User", userSchema);
