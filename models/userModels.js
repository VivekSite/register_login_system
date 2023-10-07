import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name : {type : 'string',required : true,trim : true},
  email : {type : 'string',required : true,unique : true},
  phone : {type : 'string',required : true},
  password : {type : 'string',required : true},
  question : {type : 'string',required : true},
  answer : {type : 'string',required : true},
  role :{type : 'number',required : true, default : 0}
},{timestamps: true});

export default mongoose.model('users', userSchema);