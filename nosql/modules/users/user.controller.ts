import model from "./user.model";
import bcrypt from "bcrypt";
import { Paginate } from "../blog/blog.type";
import { payloadTypes, BaseData } from "../users/user.types";

const create = async (payload: payloadTypes): Promise<BaseData | null> => {
  let { password, roles, ...rest } = payload as {
    password: string;
    roles?: string;
    [key: string]: any;
  };

  rest.password = bcrypt.hash(password, +process.env.SALT_ROUND ?? 0);
  rest.roles = roles ? [roles] : [];
  rest.isEmailVerified = true;
  rest.isActive = true;
  // return (await model.create(rest).select("-password")) as BaseData | null;; not working
  return await model.create(rest);
};
// };

const get = async (
  limit: number,
  page: number,
  search: string
): Promise<Paginate | null> => {
  const pageNum = page || 1;
  const size = limit || 4;
  const isArchive: boolean = Boolean(search);
  const query = { isArchive: false };

  try {
    const result = await model
      .aggregate([
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
      ])
      .allowDiskUse(true);
    const newResult = result[0];
    let { data, total } = newResult;

    return { data, total, limit, page };
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error();
  }
};

const getById = async (id: string): Promise<BaseData | null> => {
  console.log(id, "controller");
  return await model.findOne({ _id: id });
};

const updateById = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  return (await model
    .findOneAndUpdate({ _id: id }, payload, { new: true })
    .select("-password")) as BaseData | null;
};

const changePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<BaseData | null> => {
  // check if user exits
  const user = await model.findOne({ _id: id }).select("+password");
  if (!user) throw new Error("User not found");
  // check if old pass hash match to existing
  const isValid = await bcrypt.compare(oldPassword, user?.password);
  if (!isValid) throw new Error("oldpassword is incorrect");

  // create new password hash
  const newPass = await bcrypt.hash(newPassword, +process.env.SALT_ROUND);

  // update the userpassword
  return (await model
    .findOneAndUpdate({ _id: user?._id }, { password: newPass }, { new: true })
    .select("-password")) as BaseData | null;
};

const resetPassword = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await model.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  const newPass = await bcrypt.hash(
    payload.password as string,
    +process.env.SALT_ROUND
  );
  return await model.findOneAndUpdate(
    { _id: user?._id },
    { ...payload, password: newPass },
    { new: true }
  );
};

const block = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await model.find({ _id: id });
  if (!user) throw new Error("User not found");
  return (await model
    .findOneAndUpdate({ _id: id }, payload, { new: true })
    .select("-password")) as BaseData | null;
};

const archive = async (
  id: string,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await model.find({ _id: id });
  if (!user) throw new Error("User not found");
  return (await model
    .findOneAndUpdate({ _id: id }, payload, { new: true })
    .select("-password")) as BaseData | null;
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
