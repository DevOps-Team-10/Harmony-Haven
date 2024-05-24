
const express = require('express');
const {Product,ProductSale} = require('../../models/productModel')
const User = require('../../models/userModel')
const APIReponse = require('../../utils/apiResponse')

const createProduct = async(req,res ) => {

    try{
    const user = await User.findOne({email:req.sellerInfo.email});
    if(!user.isSeller){
        return res.status(403).json(new APIReponse(403,'You are not authorized to Create Product, Please Register As Seller '));
        }
      }catch(error){
             return res.status(500).json(new APIReponse(500,'Server Error'));
          }

    const productDetails = req.body

    const name = productDetails.name
    const productDescription = productDetails.description
    const productType=productDetails.productType
    const ProductPrice = productDetails.price
    const productQuantity=productDetails.quantity
    const imgUrl= productDetails.imgUrl


    const newProduct = new Product({
            name:name,
            description:productDescription,
            productType:productType,
            price:ProductPrice,
            quantity:productQuantity,
            imgUrl:imgUrl
    });

    try{
        const savedProduct = await newProduct.save();

        // Product Has been created Now, Store the sellerid , productid in the Table  Product Sale 
        const productId=savedProduct._id;
        const sellerEmail = req.sellerInfo.email;
        const seller= await User.findOne({email:sellerEmail});

        const newProductSale= new ProductSale({
            sellerId:seller.id,
            productId:productId
        })

        const savedProductSale = await newProductSale.save();

        return res.status(200).json(new APIReponse(200,"Product Created Successfully",savedProduct) );

    }catch(error){
        return res.status(500).json(new APIReponse(500,`Error:${error} on Creating Product`));
    }
    

  // return res.status(200).json({message:'product created successfully'})
}

const getProducts = async (req,res)=>{
        try{
            const products = await Product.find();
            return res.status(200).json(new APIReponse(200,"Products Fetched Successfully",products));

        }catch(error){
            return res.status(500).json(new APIReponse(500,`Error:${error} on Fetching Product`));
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
        const user= await User.findOne({email:req.sellerInfo.email})
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

        // Find the user by email from the request (assuming req.sellerInfo contains authenticated user info)
        const user = await User.findOne({ email: req.sellerInfo.email });
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