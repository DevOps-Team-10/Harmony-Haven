const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const apiResponse = require('../utils/apiResponse')
const User = require('../models/userModel')
const {createToken} = require('../middleware/token.js')


const users = [];

const createUser= async (req, res) => {
    
    const { userName, userEmail,userPassword, userPhone, isSeller,userAddress } = req.body;
      
    const hashedPassword = await bcrypt.hash(userPassword, 10);

      let newUser = new User({
        name: userName,
        email: userEmail,
        password: hashedPassword,
        phone: userPhone,
        isSeller: isSeller,
        address: userAddress
    });

    try{
          const savedUser= await newUser.save();
          res.status(201).json(new apiResponse(201,"User Registered Successfully",{userName,userEmail,isSeller}));
    } catch (error) {
        if(error.code === 11000){
            res.status(409).json({message:'Email Already Exist'})
        }else{
      res.status(400).json({ message: 'Error registering user' });
        }
    }
  };

  const loginUser=async (req,res)=>{
    try{
        const {userEmail,userPassword }= req.body;
        //const user= User.find(u=>u.userName===userName);
        const user = await User.findOne({email:userEmail});


        if(!user){
            return res.status(401).json(new apiResponse(401,'Invalid Credentials'));
        }

       const validPassword = await bcrypt.compare(userPassword,user.password)
       

        if(!validPassword){
            return res.status(401).json(new apiResponse(401,'Password not valid'));
        }
        else
        {
            const token= createToken(user.name,user.email);
            const successResponse = new apiResponse(200,`${userEmail} Logged In Successfully`,{name:user.name,email:user.email,isSeller:user.isSeller,address:user.address,accessToken:token})
            return res.status(200).json(successResponse);

        }

    }catch(error){
        res.status(500).json(new apiResponse(500,'Error Logging In'));
    }
  };


  const createProduct =async(req,res,)=>{

  }

  module.exports= {
    createUser,
    loginUser
  };
  