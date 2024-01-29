import { Schema, model, Document } from "mongoose";

interface IBlog extends Document {
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model<IBlog>("Blog", blogSchema);
