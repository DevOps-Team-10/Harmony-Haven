import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//for cookie

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
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        
        return {accessToken, refreshToken}
    } catch(error) {
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

export const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  // validation meaning  to check if it is not empty
  // check if use already exists
  // create user object and entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const { username, fullName, password, email } = req.body;

  if (
    [fullName, password, username, email].some(
      (field) => field?.trim() === undefined
    )
  ) {
    const jsonData = new ApiError(400, "All fields required").toJSON();
    return res
      .status(400)
      .json(new ApiError(400, "All fields required").toJSON());
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User already exists").toJSON());
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while registering the user"
        ).toJSON()
      );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User registerd Successfully").toJSON()
    );
});

export const loginUser = asyncHandler(async (req, res, next) => {
  // get data from req.body email and password
  // find the user
  // password check
  // generate access and refresh token
  // send cookie

  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json(new ApiError(400, "email and password required").toJSON());
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist").toJSON());
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid user credentials").toJSON());
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = cookieOption();

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      ).toJSON()
    );
});

export const logoutUser = asyncHandler(async(req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    console.log(await User.findById(req.user._id))

    const options = cookieOption()

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out").toJSON())
})

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

if(!incomingRefreshToken) return res.status(401).json(new ApiError(200, {}, "Unauthorised Request").toJSON())

    try {
        const decodedToken = await jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET || "qrhrukfdhlmeotldxagrdavnjvwykd")

        const user = await User.findbyId(decodedToken?._id)

        if(!user) {return res.status(401).json(ApiError(401, "Invalid refresh token").toJSON())}

        if(incomingRefreshToken !== user?.refreshToken) {
            return res.status(401, "refresh token is expired or used")
        }

        const options = cookieOption()

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefeshToken, options)
        .json(new ApiResponse(200, {
            accessToken, refreshToken: newRefeshToken
        }, "Access token refreshed"))
    } catch(error) {
        res.status(401).json(401, new ApiError(401, error?.message || "Invalid refresh token").toJSON())
    }
})
