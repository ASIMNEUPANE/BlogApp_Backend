import { Schema, model } from "mongoose";
import { Iblog } from "./blog.type";

const blogSchema = new Schema<Iblog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Technology", "Travel", "Food", "Lifestyle"],
      default: "Technology",
    },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    author: { type: String, required: true },
    totalWord: { type: Number, required: true },
    images: { type: String },
  },
  { timestamps: true } // its create updated_at & created_at time
);

export default model("Blog", blogSchema);
