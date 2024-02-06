import { Document } from "mongoose";

export interface Iblog extends Document{
   id?:string,
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
   timestamps:boolean

}

export interface DeleteResult {
	acknowledged: boolean;
	deletedCount?: number;
}

