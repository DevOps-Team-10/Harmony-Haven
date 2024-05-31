const mongoose = require('mongoose')
 const User = require('./userModel.js')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})


module.exports = mongoose.model('Blog',blogSchema);
