import { Schema, model } from "mongoose";
import { authData } from "./user.types";
const userSchema = new Schema<authData>(
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
      required: true,
    },
    images: { type: String },

    isActive: { type: Boolean, default: false },
    isArchive:{type:Boolean, default:false}
  },
  { timestamps: true }
);

export default model("User", userSchema);
