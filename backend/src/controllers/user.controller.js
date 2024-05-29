import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

//for cookie

const cookieOption = ()  => {

        return {
            httpOnly: true,
            secure: true
        }
}


export const registerUser = asyncHandler(async(req, res, next) => {
    // get user details from frontend
    // validation meaning  to check if it is not empty
    // check if use already exists
    // create user object and entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    console.log(req.body)
    const {username, fullName, password, email} = req.body
    console.log(username)

    if(
        [fullName, password, username, email].some((field) => field?.trim() === undefined)
    ) {
        const jsonData = new ApiError(400, 'All fields required').toJSON()
        console.log("jsonData: ",jsonData)
        return res
       .status(400)
       .json(new ApiError(400, "All fields required").toJSON())
    }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if(existingUser) {
        return res.status(409)
        .json(new ApiError(409, "User already exists").toJSON())
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        return res
        .status(500)
        .json(new ApiError(500, "Something went wrong while registering the user").toJSON())
    }

    return res.status(201)
    .json(new ApiResponse(200, createdUser, "User registerd Successfully").toJSON())
})

export const loginUser = asyncHandler( async (req, res, next) => {
    // get data from req.body email and password
    // find the user
    // password check
    // generate access and refresh token
    // send cookie

    const {email, password } = req.body

    if(!email &&  !password) throw new ApiError(400, "username and password required");

    const user = await User.findOne(email)

    if(!user) throw new ApiError(404, "User does not exist");

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = cookieOption()

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

