import prisma from "../../DB/db.config";
import { Iblog, DeleteResult, Paginate } from "./blog.type";

// const create = async (payload: Iblog): Promise<Iblog> => {
//   return await prisma.blog.create({ data: payload });
// };
const get = async (
  limit: number,
  page: number,
  search: { title?: string; author_id?: number }
): Promise<{
  data: any[];
  total: number;
  limit: number;
  page: number;

} | null> => {
  const pageNum = page || 1;
  const size = limit || 4;

  const whereCondition: any = {
    status: "Published",
  };
  if (search.title) {
    whereCondition.title = search.title;
  }

  if (search.author_id) {
    whereCondition.author_id = search.author_id;
  }

    // Get total count
    const total = await prisma.blog.count({
      where: whereCondition
    });

    // Fetch paginated data
    const data = await prisma.blog.findMany({
      
        where: whereCondition,
      skip: (pageNum - 1) * size,
      take: size,
    });

    return { data, total, limit: size, page: pageNum };

};

// const getById = async (id: number): Promise<Iblog | null> => {
//   return prisma.blog.findUnique({ where: { id } });
// };

// const updateById = async (
//   id: number,
//   payload: Iblog
// ): Promise<Iblog | null> => {
//   return await prisma.blog.update({ where: { id }, data: payload });
// };

// const deleteById = async (id: number): Promise<DeleteResult | null> => {
//   return await prisma.blog.delete({ where: { id } });
// };

export {
  // create,
   get,
  // getById,
  // updateById,
  // deleteById,
};
