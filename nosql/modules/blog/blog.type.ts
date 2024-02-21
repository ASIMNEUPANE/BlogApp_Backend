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
  createdAt: Date;
  updatedAt: Date;
  timestamps: boolean;
  limit?: number;
  page?: number;
  search?: string | boolean;
}
export interface Paginate {
  total: number;
  data: unknown[]; // Array of unknown elements
  limit: number;
  page: number;
}

export interface DeleteResult {
  acknowledged: boolean;
  deletedCount?: number;
}
