import model from './model';

const create =async(payload:any)=>{
return await model.create(payload)
}

const get = async()=>{
    return await model.find()
}
const getById= async (id:number)=>{
    return model.findOne({_id:id})
}
const updateById= async(id:number , payload: { [key: string]: string | number })=>{
    return await model.findOneAndUpdate(
        {_id:id},payload,{new:true}
    )
}

const deleteById=async(id:number)=>{
    return await model.deleteOne({_id:id})
}


export default  {create,get,getById,updateById,deleteById}