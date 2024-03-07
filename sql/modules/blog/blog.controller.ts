import prisma from "../../DB/db.config";
import { Blog } from "@prisma/client";
import { Iblog, DeleteResult, Paginate } from "./blog.type";
import { promises } from "dns";

const create = async (payload: any): Promise<any> => {
  console.log(payload)
  return await prisma.blog.create({data : payload});
};

const get = async():Promise<any>=>{
  const result = await prisma.blog.findMany({})
  console.log(result,'findmany')
  return result
}

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

const getById = async (id: number): Promise<any> => {
  return prisma.blog.findUnique({ where:{id:id} });
};

const updateById = async (
  id: number,
  payload: any
): Promise<any > => {
  return await prisma.blog.update({ where:{id:id}, data:{...payload} });
};

const deleteById = async (id: number): Promise<any> => {
  return await prisma.blog.delete({where:{id:id} });
};

export { create,get,
    getById, updateById, deleteById 
  };
