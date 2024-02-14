import model from "./user.model";
import bcrypt from "bcrypt";

const create = async (payload) => {
  const {password,roles ,...rest}= payload;
  rest.password = await bcrypt.hash(password,+process.env.SALT_ROUND)
  rest.roles=[roles]
  rest.isEmailVerified = true
  rest.isActive = true
  return await model.create(rest);
};




export default {
  // archive,
  // block,
  // changePassword,
  create,
  // getById,
  // list,
  // resetPassword,
  // updateById,
};
