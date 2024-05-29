
const express = require('express');
const {Product,ProductSale} = require('../../models/productModel')
const User = require('../../models/userModel')
const APIReponse = require('../../utils/apiResponse')

const createProduct = async(req,res ) => {
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
        return res.status(200).json(new APIReponse(200,"Product Detail Fetched",product));
  
      }catch(error){
          return res.status(500).json(new APIReponse(500,`Error Fetching Data ${error}`));
      }
};

module.exports={
    createProduct,
    getProducts,
    fetchProduct:fetchProductDetail
}