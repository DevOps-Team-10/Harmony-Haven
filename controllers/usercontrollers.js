const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const apiResponse = require('../utils/apiResponse')
const User = require('../models/userModel.js')
const { createToken } = require('../middleware/token.js');
const { Product } = require('../models/productModel.js');


const users = [];

// const createUser = async (req, res) => {

//   const { userName, userEmail, userPassword, userPhone, userAddress } = req.body;
//   console.log(req.body)

//   const hashedPassword = await bcrypt.hash(userPassword, 10);

//   let newUser = new User({
//     name: userName,
//     email: userEmail,
//     password: hashedPassword,
//     phone: "",
//     isSeller: false,
//     address: ""
//   });

//   try {
//     const savedUser = await newUser.save();
//     console.log(savedUser)
//     res.status(201).json(new apiResponse(201, "User Registered Successfully", { userName, userEmail, isSeller }));
//   } catch (error) {
//     console.log(error)
//     if (error.code === 11000) {
//       res.status(409).json({ message: 'Email Already Exist' })
//     } else {
//       res.status(400).json({ message: 'Error registering user' });
//     }
//   }
// };

const cookieOption = () => {
  return {
    httpOnly: true,
    secure: true,
  };
};

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        await user.save({validateBeforeSave: false})
        
        return {accessToken}
    } catch(error) {
      return res.status(500).json(new apiResponse(500,{}, "Something went wrong while generating access and refresh token"))
    }
}


const createUser = async (req, res) => {
  const { name, password, email } = req.body;
  

  if (
    [password, name, email].some(
      (field) => field?.trim() === undefined
    )
  ) {
    return res
      .status(400)
      .json(400, { message: "All fields required" })
  }

  const existingUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists" });
  }

  const user = await User.create({
    email,
    password,
    name: name.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(500,
        { message: "Something went wrong while registering the user" }
      )
  }

  return res
    .status(201)
    .json(
      new apiResponse(201,"User registerd Successfully", createdUser)
    );
}

// const loginUser = async (req, res) => {
//   try {
//     const { userEmail, userPassword } = req.body;
//     //const user= User.find(u=>u.userName===userName);
//     const user = await User.findOne({ email: userEmail });


//     if (!user) {
//       return res.status(401).json(new apiResponse(401, 'Invalid Credentials'));
//     }

//     const validPassword = await bcrypt.compare(userPassword, user.password)


//     if (!validPassword) {
//       return res.status(401).json(new apiResponse(401, 'Password not valid'));
//     }
//     else {
//       const token = createToken(user.name, user.email);
//       const successResponse = new apiResponse(200, `${userEmail} Logged In Successfully`, { id: user._id, name: user.name, email: user.email, isSeller: user.isSeller, address: user.address, accessToken: token })
//       return res.status(200).json(successResponse);

//     }

//   } catch (error) {
//     res.status(500).json(new apiResponse(500, 'Error Logging In'));
//   }
// };

const loginUser = (async (req, res, next) => {
  // get data from req.body email and password
  // find the user
  // password check
  // generate access and refresh token
  // send cookie

 try {
   const { email, password } = req.body;
 
   if (!email && !password) {
     return res.status(400).json(new apiResponse(400, {message: "email and password required"}));
   }
 
   const user = await User.findOne({email});
 
   if (!user) {
     return res.status(404).json(new apiResponse(404, {message: "User does not exist"}));
   }
   const isPasswordValid = await user.isPasswordCorrect(password);
 
   if (!isPasswordValid) {
     return res.status(401).json(new apiResponse(401,{message: "Invalid user credentials"}));
   }
 
   const { accessToken } = await generateAccessAndRefreshToken(
     user._id
   );
 
   const loggedInUser = await User.findById(user._id).select(
     "-password -refreshToken"
   );
 
   const options = cookieOption();
 
   return res.status(200)
     .cookie("accessToken", accessToken, options)
     .json(
       new apiResponse(
         200,
         "User logged in successfully",
         {
          ...loggedInUser.toObject(),
          accessToken
         }
       )
     );
 } catch (error) {
  res.status(500).json(new apiResponse(500, {message: 'Error Logging In'} ));
 }
});

const logoutUser = async(req, res) => {
  await User.findByIdAndUpdate(
      req?.user?._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = cookieOption()

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .json(new apiResponse(200, {message: "Logged out successfully"}))
}


module.exports = {
  createUser,
  loginUser,
  logoutUser
};
