import model from "./user.model";
import bcrypt from "bcrypt";
import { Paginate } from "../blog/blog.type";
import { payloadTypes, BaseData } from "../users/user.types";

export const create = async (
  payload: payloadTypes
): Promise<BaseData | null> => {
  let { password, roles, ...rest } = payload as {
    password: string;
    roles?: string;
    [key: string]: any;
  };
  rest.password = await bcrypt.hash(password, +process.env.SALT_ROUND );
  rest.roles =  [roles] ;
  rest.isEmailVerified = true;
  rest.isActive = true;
  // return (await model.create(rest).select("-password")) as BaseData | null;; not working
  const result = await model.create(rest);
  return result;
};
// };

export const get = async (
  limit: number,
  page: number
): Promise<Paginate | null> => {
  const pageNum = page || 1;
  const size = limit || 4;
  const query = { isArchive: false };

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
    {
      $project: {
        "data.password": 0,
      },
    },
  ]);

  const newResult = result[0];
  let { data, total } = newResult;
  total = total || 0;
  return { data, total, limit, page };
};
// export const get = async(limit:number,page:number,search:string,  )=>{

//   const skip = (page - 1) * limit; // Calculate the number of documents to skip
//     const query = { name: search.name || null }; // Assuming you're filtering by name

//     try {
//         // Query MongoDB to get paginated data
//         const data = await model.find(query).skip(skip).limit(limit);
//         const total = await model.countDocuments(query); // Count total matching documents

//         return {
//             data: data,
//             total: total,
//             page: page,
//             limit: limit
//         };
//     } catch (error) {
//         console.error("Error occurred while fetching paginated data:", error);
//         throw error; // Rethrow the error for handling at a higher level
//     }
// }

export const getById = async (id: string): Promise<BaseData | null> => {
  return await model.findOne({ _id: id });
};

export const updateById = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

export const changePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<BaseData | null> => {
  // check if user exits
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  // check if old pass hash match to existing
  const isValid = await bcrypt.compare(oldPassword, user?.password);
  if (!isValid) throw new Error("oldpassword is incorrect");

  // create new password hash
  const newPass = await bcrypt.hash(newPassword, +process.env.SALT_ROUND);

  // update the userpassword
  return await model.findOneAndUpdate(
    { _id: user?._id },
    { password: newPass },
    { new: true }
  );
  // .select("-password")) as BaseData | null;
};

export const resetPassword = async (
  id: string,
  password: string
): Promise<BaseData | null> => {
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  const newPass = await bcrypt.hash(
    password as string,
    +process.env.SALT_ROUND
  );
  return await model.findOneAndUpdate(
    { _id: user?._id },
    { password: newPass },
    { new: true }
  );
};

export const block = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
  // .select("-password")) as BaseData | null;
};

export const archive = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
  // .select("-password")) as BaseData | null;
};

export default {
  archive,
  block,
  changePassword,
  create,
  getById,
  get,
  resetPassword,
  updateById,
};
