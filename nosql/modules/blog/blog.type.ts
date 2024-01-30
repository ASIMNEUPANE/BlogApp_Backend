import { Document } from "mongoose";

export interface Iblog extends Document{
   title :string,
   content:string,
   description :string,
   category:string,
   status:string,
   author:string,
   totalWord:number,
   images?:string,
   created_at:Date,
   updated_at:Date,

}


