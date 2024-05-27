const express = require('express');
const mongoose = require('mongoose');
const { Order, OrderDetails } = require('../../models/orderModel');
const User = require('../../models/userModel');
const { Product } = require('../../models/productModel');
const APIResponse = require('../../utils/apiResponse');

const orderItems = async (req, res) => {
    const { items, orderStatus, paymentDone } = req.body;

    try {
        const user = await User.findOne({ email: req.userInfo.email });
        const userId = user._id;

        // Create the order first
        const newOrder = new Order({
            orderStatus: orderStatus || 'Pending',
            paymentDone: paymentDone || false,
            address: user.address,
            userId: userId,
        });
        const savedOrder = await newOrder.save();

        // Now create order details for each item
        const orderDetailsPromises = items.map(async (item) => {
            const { productId, quantity } = item;

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            if (quantity > product.quantity) {
                throw new Error(`Ordered quantity of product ${product.name} exceeds available stock`);
            }

            // Create order details for each item with orderId set to the ID of the saved order
            const newOrderDetails = new OrderDetails({
                productId: productId,
                quantity: quantity,
                price: product.price * quantity,
                orderId: savedOrder._id, // Assign the orderId from the savedOrder
            });
            const savedOrderDetails = await newOrderDetails.save();

            // Update product quantity
            product.quantity -= quantity;
            await product.save();

            return savedOrderDetails;
        });

        // Wait for all order details to be saved
        const orderDetails = await Promise.all(orderDetailsPromises);

        res.status(201).json(new APIResponse(201, 'Order placed successfully', {
            order: savedOrder,
            orderDetails: orderDetails,
        }));
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json(new APIResponse(500, 'Internal Server Error', { error: error.message }));
    }
};

module.exports = {
    orderItems
};
