import prisma from "../../DB/db.config";
import { Iblog, DeleteResult, Paginate } from "./blog.type";

const create = async (payload: Iblog): Promise<Iblog> => {
  return await prisma.blog.create({ data: payload });
};

// const get = async (
//   limit: number,
//   page: number,
// ): Promise<Paginate | null> => {
//   const pageNum = page || 1;
//   const size = limit || 4;

//   // const query = { status: status || "published" }; this is not working

//   const query = { status: "published" };

//     const result = await model
//       .aggregate([
//         {
//           $facet: {
//             // Stage 1: Calculate the total count
//             total: [
//               {
//                 $match: query,
//               },
//               {
//                 $count: "total",
//               },
//             ],
//             // Stage 2: Fetch paginated data
//             data: [
//               {
//                 $match: query,
//               },
//               {
//                 $skip: (pageNum - 1) * size,
//               },
//               {
//                 $limit: size,
//               },
//             ],
//           },
//         },
//         {
//           $project: {
//             total: { $arrayElemAt: ["$total.total", 0] }, // Extract total count from the 'total' array
//             data: 1, // Include the 'data' array
//             limit: size,
//             page: pageNum,
//           },
//         },
//       ])
//       // .allowDiskUse(true);
//     const newResult = result[0];
//     let { data,total } = newResult;
//     total = total || 0;

//     return { data, total, limit, page };

// };

const getById = async (id: number): Promise<Iblog | null> => {
  return prisma.blog.findUnique({ where: { id } });
};

const updateById = async (
  id: number,
  payload: Iblog
): Promise<Iblog | null> => {
  return await prisma.blog.update({ where: { id }, data: payload });
};

const deleteById = async (id: number): Promise<DeleteResult | null> => {
  return await prisma.blog.delete({ where: { id } });
};

export {
  create,
  //  get,
  getById,
  updateById,
  deleteById,
};
