const express = require('express');
const mongoose = require('mongoose');
const {Order,OrderDetails} = require('../../models/orderModel');
const User= require('../../models/userModel');
const {Product} = require('../../models/productModel');
const APIReponse = require('../../utils/apiResponse');

const orderItems = async (req,res)=>{
    const productId = req.params.id;
    const { quantity, orderStatus, paymentDone } = req.body;
    
    try{
        //getting the userid from the authorized token
        const user = await User.findOne({email:req.userInfo.email});
        const userId = user._id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(new APIReponse(404,'Product not found'));
        }

                // Check if the ordered quantity is available
            if (quantity > product.quantity) {
            return res.status(400).json(new APIReponse(400, 'Ordered quantity exceeds available stock'));
          }

        const status = orderStatus || 'Pending';
        const isPaymentDone = paymentDone === true;

        const newOrder = new Order({
            orderStatus: status,
            paymentDone: isPaymentDone,
            address: user.address,
            userId: userId
        });

        const savedOrder = await newOrder.save();

        const newOrderDetails = new OrderDetails({
            orderId: savedOrder._id,
            productId: productId,
            quantity: quantity,
            price: product.price * quantity // Assuming price is per unit
        });

        const savedOrderDetails = await newOrderDetails.save();

               // Update the product quantity
               product.quantity -= quantity;
               await product.save();

        const populatedOrderDetails = await OrderDetails.findById(savedOrderDetails._id).populate('productId').exec();
               
        res.status(201).json(new APIReponse(201, 'Order placed successfully', {
            order: savedOrder,
            orderDetails: populatedOrderDetails
        }));

    }catch(error){
        console.error('Error placing order:', error);
        res.status(500).json(new APIReponse(500,'Internal Server Error',{ error: error.message }));
    }

};

module.exports={
    orderItems
}

