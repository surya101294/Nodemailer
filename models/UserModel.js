const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
name:{type:String,required:true},
email:{type:String},
password:{type:String},
role:{type:String},
phone:{type:Number},
},{
    versionKey:false
})


const UserModel = mongoose.model("user",userSchema)

module.exports={
    UserModel
}