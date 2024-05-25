const  mongoose  = require("mongoose");

const orderSchema = mongoose.Schema({
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentDone: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{timestamps:true}

);

const Order = mongoose.model('Order',orderSchema);

const orderDetailsSchema = mongoose.Schema({
orderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Order',
    required:true
},
productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
},
quantity: {
    type: Number,
    required: true
},
price: {
    type: Number,
    required: true
}
}, { timestamps: true }

);

const OrderDetails = mongoose.model('OrderDetails',orderDetailsSchema);

module.exports= {
    Order,
    OrderDetails
}