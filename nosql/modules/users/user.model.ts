import { Schema, model , ObjectId} from "mongoose";
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
      type: [String],
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    images: { type: String },

    isActive: { type: Boolean, default: false },
    
    isArchive: { type: Boolean, default: false },
    created_by:{type:Schema.ObjectId, ref:"User"},
    updated_by:{type:Schema.ObjectId, ref:"User"}
  },
  { timestamps: true }
);

export default model("User", userSchema);
