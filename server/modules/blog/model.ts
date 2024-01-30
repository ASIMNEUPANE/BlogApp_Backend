import { Schema, model, Document } from "mongoose";





const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author:{type:String, required:true},
  totalWord:{type:Number, required:true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model("Blog", blogSchema);
