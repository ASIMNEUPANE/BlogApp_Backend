import model from "./model";


const create = async (payload:any) => {
  return await model.create(payload);
};

const get = async () => {
  return await model.find();
};
const getById = async (id:string) => {
  return model.findOne({ _id: id });
};
const updateById = async (
  id: string,
  payload:any 
) => {
  return await model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deleteById = async (id: number) => {
  return await model.deleteOne({ _id: id });
};

export default { create, get, getById, updateById, deleteById };
