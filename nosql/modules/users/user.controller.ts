import model from "./user.model";
import bcrypt from "bcrypt";
import {Paginate} from "../blog/blog.type"
import { Iblog } from "../blog/blog.type";
import {UpdatePayload,resetPayload,blockPayload,deletePayload} from  "../users/user.types"

const create = async (payload:any) => {
  const {password,roles ,...rest}= payload;
  rest.password = await bcrypt.hash(password,+process.env.SALT_ROUND)
  rest.roles=[roles]
  rest.isEmailVerified = true
  rest.isActive = true
  return await model.create(rest);
};

const get = async (
  limit: string,
  page: string,
  search: string
): Promise<Paginate[]> => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 4;
  const isArchive: boolean = Boolean(search);
  const query = {isArchive: false} 

  try {
    const result = await model.aggregate([
      {
        $facet: {
          // Stage 1: Calculate the total count
          total: [
            {
              $match:query ,
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
    ]).allowDiskUse(true);;
    const newResult = result[0];
    const { data, total } = newResult;

    return { data, total, limit, page };
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error();
  }
};

const getById = async (id: string): Promise<Iblog | null> => {
  // console.log(id,'controller')
  return await model.findOne({ _id: id });
};

const updateById = async (id:string, payload:UpdatePayload) => {
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const changePassword = async (id:string, oldPassword:string, newPassword:string) => {
  // check if user exits
  const user = await model.findOne({ _id: id }).select("+password");
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
};

const resetPassword = async (id:string, payload:resetPayload) => {
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  const newPass = await bcrypt.hash(payload.password, +process.env.SALT_ROUND);
  return await model.findOneAndUpdate(
    { _id: user?._id },
    { ...payload,password: newPass },
    { new: true }
  );
};

const block = async (id:string, payload:blockPayload) => {
  const user = await model.find({ _id: id });
  if (!user) throw new Error("User not found");
  return await model.findOneAndUpdate({ _id:id}, payload, {new: true})
};

const archive = async (id:string,payload:deletePayload)=>{
  const user = await model.find({ _id: id });
  if (!user) throw new Error("User not found");
  return await model.findOneAndUpdate({ _id:id}, payload, {new: true})
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
