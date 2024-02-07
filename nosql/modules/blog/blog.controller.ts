import model from "./blog.model";
import { Iblog, DeleteResult,Paginate  } from "./blog.type";

const create = async (payload: Iblog): Promise<Iblog> => {
  return await model.create(payload);
};

const get = async (
  limit: number,
  page: number,
  search: string
): Promise<Paginate[]> => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 4;
  const status = typeof search === "string" ? search : "published"; // Set status based on search

  const query = { status: status || "published" };

  try {
    let total = await model.countDocuments(query)
    const data = await model
      .find(query)
      .skip((pageNum - 1) * size)
      .limit(size)
      .lean().explain(); // Paginate the data


    return { data, total, limit: size, page: pageNum };
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error;
  }
};

const getById = async (id: string): Promise<Iblog | null> => {
  return model.findOne({ _id: id });
};

const updateById = async (
  id: string,
  payload: Iblog
): Promise<Iblog | null> => {
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deleteById = async (id: string): Promise<DeleteResult> => {
  return await model.deleteOne({ _id: id });
};

export default { create, get, getById, updateById, deleteById };
