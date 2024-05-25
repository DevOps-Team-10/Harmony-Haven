const mongoose = require('mongoose');
const express = require('express');
const Review = require('../../models/productReviewModel');
const User = require ('../../models/userModel');
const {Product} = require('../../models/productModel');
const {Order,OrderDetails} = require('../../models/orderModel');
const APIReponse = require('../../utils/apiResponse')

const reviewProduct = async (req,res)=>{
    try{

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json(new APIReponse(404, 'Product not found'));
        }
        const productId= product._id;

        const user= await User.findOne({email:req.userInfo.email});
        const userId= user._id;


        // Lets Come from the OrderDetails Side
        // check the orderDetails table and see if there is user corresponding to productId
        
             // Find the OrderDetails that includes the productId
             const orderDetailsList = await OrderDetails.find({ productId }).populate('orderId');

             if (!orderDetailsList || orderDetailsList.length === 0) {
                 return res.status(403).json(new APIReponse(403, 'Not allowed to review this product. Purchase required.'));
             }

                 // Check if the user has completed any order for this product
        const validOrderDetails = orderDetailsList.find(orderDetails => 
            orderDetails.orderId.userId.toString() === userId.toString() && 
            orderDetails.orderId.orderStatus === 'Completed'
        );

        if (!validOrderDetails) {
            return res.status(403).json(new APIReponse(403, 'Not allowed to review this product. Purchase required.'));
        }
        
        const orderDetail = await OrderDetails.findOne({productId,userId}).populate('orderId')


        const {rating,review}= req.body;

      
        const newReview = new Review({
            userId,
            productId,
            rating,
            review
        });

         // Save the review to the database
         const savedReview = await newReview.save();

                 // Calculate the new average rating
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRating / reviews.length;

        // Update the product's average rating
        product.averageRating = averageRating;
        await product.save();

         res.status(201).json(new APIReponse(201, 'Review added successfully', savedReview));

   }catch(error){
    console.error('Error adding review:', error);
    res.status(500).json(new APIReponse(500, 'Internal Server Error', { error: error.message }));
    }

};

module.exports ={
    reviewProduct
}