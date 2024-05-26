const mongoose = require('mongoose');

// Define the Schema
const createProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    productType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        data: Buffer, // Store the binary data of the image
        contentType: String // Store the content type of the image (e.g., 'image/jpeg')
    },
    averageRating: {
        type: Number,
        required: true,
        default: 0
    }
});

const productSaleSchema = new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
});

// Create the Model
const Product = mongoose.model('Product', createProductSchema);
const ProductSale = mongoose.model('ProductSale', productSaleSchema);

module.exports = {
    Product,
    ProductSale
};
