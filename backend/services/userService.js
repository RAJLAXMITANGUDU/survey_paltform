import User from '../models/userModel.js';

export const add=async({name,password,email})=>{
const data={name,password,email};
const updatedData=new User(data);
return await updatedData.save(); 
}

export const findUserByEmail=async(email)=>{
return User.findOne({email});
}


export const findUserById=async(id)=>{
return await User.findById(id).select("-password");
}