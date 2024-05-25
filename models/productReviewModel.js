const mongoose = require('mongoose')


const reviewSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:false
    }
}, {timestamps:true}
);

module.exports= mongoose.model('Review',reviewSchema)