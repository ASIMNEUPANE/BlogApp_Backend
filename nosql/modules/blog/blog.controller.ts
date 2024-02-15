import model from "./blog.model";
import { Iblog, DeleteResult, Paginate } from "./blog.type";

const create = async (payload: Iblog): Promise<Iblog> => {
  return await model.create(payload);
};

const get = async (
  limit: string,
  page: string,
  search: string
): Promise<Paginate[]> => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 4;
  const status = typeof search === "string" ? search : "published"; // Set status based on search

  const query = { status: status || "published" };

  try {
    const result = await model.aggregate([
      {
        $facet: {
          // Stage 1: Calculate the total count
          total: [
            {
              $match: query,
            },
            {
              $count: "total",
            },
          ],
          // Stage 2: Fetch paginated data
          data: [
            {
              $match: query,
            },
            {
              $skip: (pageNum - 1) * size,
            },
            {
              $limit: size,
            },
          ],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ["$total.total", 0] }, // Extract total count from the 'total' array
          data: 1, // Include the 'data' array
          limit: size,
          page: pageNum,
        },
      },
    ]);
    const newResult = result[0];
    const { data, total } = newResult;

    return { data, total, limit, page };
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error();
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

const deleteById = async (id: string): Promise<DeleteResult | null> => {
  return await model.deleteOne({ _id: id });
};

export default { create, get, getById, updateById, deleteById };
