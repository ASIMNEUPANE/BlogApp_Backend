import { Document } from "mongoose";

export interface Iblog extends Document {
  id?: string;
  title: string;
  content: string;
  description: string;
  category: string;
  status: string;
  author: string;
  totalWord: number;
  images?: string;
  created_at: Date;
  updated_at: Date;
  timestamps: boolean;
  limit?: number;
  page?: number;
  search?: string | boolean;
}
export interface Paginate extends Iblog {
  total: number;
  data: unknown[]; // Array of unknown elements
  limit: number;
  page: number;
}

export interface DeleteResult  {
  acknowledged: boolean;
  deletedCount?: number;
}
