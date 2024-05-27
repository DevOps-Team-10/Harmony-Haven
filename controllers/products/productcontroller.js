
const express = require('express');
const {Product,ProductSale} = require('../../models/productModel')
const User = require('../../models/userModel')
const APIReponse = require('../../utils/apiResponse')

const createProduct = async (req, res) => {
    try {
        // Check if user is a seller
        const user = await User.findOne({ email: req.userInfo.email });
        if (!user || !user.isSeller) {
            return res.status(403).json(new APIReponse(403, 'You are not authorized to create a product. Please register as a seller.'));
        }

        // Extract product details from request body
        const { name, description, productType, price, quantity } = req.body;

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json(new APIReponse(400, 'No image uploaded.'));
        }

        // Extract image details from multer file upload
        const image = {
            data: req.file.buffer, // File data buffer
            contentType: req.file.mimetype // File content type
        };

        // Create new product instance
        const newProduct = new Product({
            name,
            description,
            productType,
            price,
            quantity,
            image
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Store sellerId and productId in ProductSale table
        const newProductSale = new ProductSale({
            sellerId: user.id,
            productId: savedProduct._id
        });
        const savedProductSale = await newProductSale.save();

        // Respond with success message and saved product data
        return res.status(200).json(new APIReponse(200, 'Product created successfully', savedProduct));
    } catch (error) {
        // Handle errors
        console.error('Error creating product:', error);
        return res.status(500).json(new APIReponse(500, `Error creating product: ${error.message}`));
    }
};


const getProducts = async (req, res) => {
    try {
        // Fetch products from the database
        const products = await Product.find();

        // Convert image buffer data to Base64-encoded image URLs
        const productsWithBase64Images = products.map(product => {
            const base64Image = Buffer.from(product.image.data).toString('base64');
            const imageUrl = `data:${product.image.contentType};base64,${base64Image}`;
            return {
                _id:product._id,
                name: product.name,
                description: product.description,
                productType: product.productType,
                price: product.price,
                quantity: product.quantity,
                image: imageUrl
            };
        });

        // Send the response with products including Base64-encoded image URLs
        return res.status(200).json(new APIReponse(200, "Products Fetched Successfully", productsWithBase64Images));
    } catch (error) {
        // Handle errors
        console.error('Error fetching products:', error);
        return res.status(500).json(new APIReponse(500, `Error fetching products: ${error.message}`));
    }
};


const fetchProductDetail = async  (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product)
            return res.status(404).json(new APIReponse(404,'Product Not Found'));

        return res.status(200).json(new APIReponse(200,"Product Detail Fetched",product));
  
      }catch(error){
          return res.status(500).json(new APIReponse(500,`Error Fetching Data ${error}`));
      }
};

const deleteProduct= async (req,res)=>{
    try{
        // Know the seller 
        const product = await Product.findById(req.params.id);
        const user= await User.findOne({email:req.userInfo.email})
        if(!product){
            return res.status(304).json(new APIReponse(304,'Product Not Found'));
        }
        const productSale= await ProductSale.findOne({productId:product._id});
        if(productSale){
            const productSellerId = productSale.sellerId;
        
        if(productSellerId == user.id){
            // delete from Product Collection
           const deleteItem= await Product.deleteOne({_id:product._id});

            //Remove from the ProductSale too
            await ProductSale.deleteOne({productId:product._id})

            return res.status(201).json(new APIReponse(201,`Product '${product.name}' Deleted Successfully`));
        }
        else{
            return res.status(405).json(new APIReponse(405,'User is not Authorized to Delete the Product'));
        }
        }
        else{
            return res.status(404).json(new APIReponse(404,'issue with fetching product Details'));
        }
       
    }catch(error){
        return res.staus(500).json(new APIReponse(500,"Error while Deleting the Product"));
    }
};

const updateProduct = async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json(new APIReponse(404,'Product Not Found'));
        }

        // Find the user by email from the request (assuming req.userInfo contains authenticated user info)
        const user = await User.findOne({ email: req.userInfo.email });
        if (!user) {
            return res.status(403).json(new APIReponse(403,'Unauthorized'));
        }

        // Find the product sale record to verify the seller
        const productSale = await ProductSale.findOne({ productId: product._id });
        if (!productSale || productSale.sellerId.toString() !== user._id.toString()) {
            return res.status(403).json(new APIReponse(403,'Unauthorized'));
        }

        // Update the product fields with the data from the request body
        const updatedProductData = req.body;
        for (const key in updatedProductData) {
            if (updatedProductData.hasOwnProperty(key) && product.schema.paths[key]) {
                product[key] = updatedProductData[key];
            }
        }

        // Save the updated product
        const updatedProduct = await product.save();
        return res.status(200).json(new APIReponse(200,'Product Updated Successfully',{product:updatedProduct}));

    } catch (error) {
        console.error("Error updating product: ", error);
        return res.status(500).json(new APIReponse(500,'Internal Server Error', {error: error.message}) );
    }
};
module.exports={
    createProduct,
    getProducts,
    fetchProduct:fetchProductDetail,
    deleteProduct,
    updateProduct
}