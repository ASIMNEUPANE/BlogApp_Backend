import bcrypt from "bcrypt";
// import { Paginate } from "../blog/blog.type";
import { payloadTypes, BaseData } from "../users/user.types";
import prisma from "../../DB/db.config";

export const create = async (payload: payloadTypes): Promise<any | null> => {
  let { password, ...rest } = payload as {
    password: string;
    roles?: string;
    [key: string]: any;
  };

  rest.password = await bcrypt.hash(password, +process.env.SALT_ROUND);
  rest.isEmailVerified = true;
  rest.isActive = true;
  rest.email = payload.email;
  rest.name = payload.name;
  const result = await prisma.user.create({ data: rest });
  return result;
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const get = async (
  limit: number,
  page: number
): Promise<{
  data: any[];
  total: number;
  limit: number;
  page: number;
} | null> => {
  const pageNum = page || 1;
  const size = limit || 4;

  const total = await prisma.user.count({
    where: {
      isArchive: false,
    },
  });

  const data = await prisma.user.findMany({
    where: {
      isArchive: false,
    },
    skip: (pageNum - 1) * size,
    take: size,
    select: {
      password: false,
    },
  });

  return { data, total, limit: size, page: pageNum };
};

export const getById = async (id: number): Promise<BaseData | null> => {
  console.log(id, "controller");
  return await prisma.user.findUnique({ where: { id } });
};

export const updateById = async (
  id: number,
  payload: payloadTypes
): Promise<BaseData | null> => {
  return await prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      images: payload.images,
    },
  });
};

export const changePassword = async (
  id: number,
  oldPassword: string,
  newPassword: string
): Promise<BaseData | null> => {
  // check if user exits
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  // check if old pass hash match to existing
  const isValid = await bcrypt.compare(oldPassword, user?.password);
  if (!isValid) throw new Error("oldpassword is incorrect");

  // create new password hash
  const newPass = await bcrypt.hash(newPassword, +process.env.SALT_ROUND);

  // update the userpassword
  return await prisma.user.update({
    where: { id },
    data: { password: newPass },
  });
};

export const resetPassword = async (
  id: number,
  password: string
): Promise<BaseData | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  const newPass = await bcrypt.hash(
    password as string,
    +process.env.SALT_ROUND
  );
  return await prisma.user.update({
    where: { id: user?.id },
    data: { password: newPass },
  });
};

export const block = async (
  id: number,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return await prisma.user.update({ where: { id }, data: payload });
  // .select("-password")) as BaseData | null;
};

export const archive = async (
  id: number,
  payload: payloadTypes
): Promise<BaseData | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return await prisma.user.update({ where: { id }, data: payload });
};

export default {
  archive,
  block,
  changePassword,
  create,
  getById,
  // get,
  resetPassword,
  updateById,
};
