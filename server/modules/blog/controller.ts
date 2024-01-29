import model from './model';

const create =async(payload:any)=>{
return await model.create(payload)
}

const get = async()=>{
    return await model.find()
}
const getById= async (id:any)=>{
    return model.findOne({_id:id})
}


export default  {create,getById}