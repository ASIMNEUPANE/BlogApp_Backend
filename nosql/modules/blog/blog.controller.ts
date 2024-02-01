import model from "./blog.model";
import { Iblog,DeleteResult } from "./blog.type";

const create = async (payload: Iblog): Promise<Iblog> => {
  return await model.create(payload);
};

const get = async (): Promise<Iblog[]> => {
  return await model.find();
};

const getById = async (id: string): Promise<Iblog |null> => {
  return model.findOne({ _id: id });
};

const updateById = async (id: string, payload: Iblog): Promise<Iblog |null> => {
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deleteById = async (id: string):Promise<DeleteResult> => {
  return await model.deleteOne({ _id: id });
};

export default { create, get, getById, updateById, deleteById };
