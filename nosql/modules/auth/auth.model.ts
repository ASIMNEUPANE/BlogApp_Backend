import {  Schema ,model} from "mongoose";
import { Iauth } from "./auth.types";

const authSchema = new Schema<Iauth>({
  email: { type: String },
  token: { type: Number },
},
{timestamps:true});

export default model("Auth", authSchema)
