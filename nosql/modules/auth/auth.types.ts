import { Document } from "mongoose";
import {z} from "zod"
import {registerValidator} from './auth.validator'

export interface Iauth extends Document{
    email:string;
    token:number;
    timestamps: Date;

}
// export interface authData {
//     name: string,
//   email:string,
//   password: string,
//   image?:String,
// }
export type authData = z.infer<typeof registerValidator>  
   