const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:false,
    },
    isSeller:{
        type:Boolean,
        required:true
    },
    address :{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('User',userSchema);