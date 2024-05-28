const mongoose = require('mongoose')
const express = require('express')
const APIReponse = require('../utils/apiResponse')
const {Community} = require('../models/communityModel')
const User = require('../models/userModel')

const createCommunity = async (req,res)=>{
    const {name} = req.body;
    try{
       const user = await User.findOne({email:req.userInfo.email})
       if(!user){
        res.status(404).json(new APIReponse(404, 'User Not Available'));
       }

       const newCommunity = new Community({
        communityName:name,
        owner:user._id
       })

       const savedCommunity = await newCommunity.save();
       return res.status(200).json(new APIReponse(200,'Community Created Successfully',savedCommunity));


    }catch(error){
        res.status(500).json(new APIReponse(500, 'Internal Server Error', { error: error.message }));
    }

};


const getCommunity= async (req,res)=>{
    try{
 
        const community = await Community.find();
        return res.status(200).json(new APIReponse(200, "Communities Fetched Successfully", community));
    }catch(error){
        res.status(500).json(new APIReponse(500, 'Internal Server Error', { error: error.message }));
    }
}



module.exports = {
    createCommunity,
    getCommunity
}