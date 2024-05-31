
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     phone:{
//         type:Number,
//         required:false,
//     },
//     isSeller:{
//         type:Boolean,
//         required:true
//     },
//     address :{
//         type:String,
//         required:false
//     }
// });

// module.exports = mongoose.model('User',userSchema);


const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone:{
        type:Number,
        required:false,
    },
    isSeller:{
        type:Boolean,
        required:false
    },
    address :{
        type:String,
        required:false
    }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.SECRET_KEY || 'gnrceaglfrdmhragonjuxlsihaojgu',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET || 'qrhrukfdhlmeotldxagrdavnjvwykd',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "24h"
        }
    )
}

module.exports = mongoose.model('User',userSchema);