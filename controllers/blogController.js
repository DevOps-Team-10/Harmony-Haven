const apiResponse = require('../utils/apiResponse')
const Blog = require('../models/blogModel');
const mongoose = import('mongoose')

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('owner', '-password')
        res.status(200).json(blogs)
    } catch (error) {
        res.status(500).json(new apiResponse(401, { message: error.message }));
    }
}

const getBlogById = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json(new apiResponse(404, { message: "Blog not found" }))
        return res.status(200).json(new apiResponse(200, 'blog recieved', blog))

    } catch (error) {
        res.status(500).json(new apiResponse(500, { message: error.message }));
    }
}

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body
        if ([title, content].some((field) => field === undefined)) return res.status(400).json(new apiResponse(400, { message: "Enter all fields" }))
        const userInfo = req.userInfo
        const blog = new Blog({
            title: title,
            content: content,
            owner: req?.userInfo
        })
        const savedBlog = await blog.save();
        res.status(200).json(new apiResponse(200, {message: "Blog created Successfuly"}, savedBlog))
    } catch (error) {
        res.status(500).json(new apiResponse(500, {message: error.message}))
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(!blog) return res.status(400).json(new apiResponse(400, "Blog not found"))

        await Blog.findByIdAndDelete(req.params.id)
        return res.status(200).json(new apiResponse(200, "Blog successfully deleted"))

    } catch(error) {
        res.status(500).json(new apiResponse(500, {message: error.message}))
    }
}

const updateBlog = async (req, res) => {
    try {
        const {title, content, likes} = req.body
        const {userInfo} = req
        const blog = await Blog.findById(req.params.id)
        if(!blog) return res.status(400).json(new apiResponse(400, "Blog not found"))
        await Blog.findByIdAndUpdate(req.params.id, {title, content, likes})
        return res.status(200).json(new apiResponse(200, "Blog successfully updated"))

    }catch(error) {
        res.status(500).json(new apiResponse(500, {message: error.message}))
    }
}

const getMyBlogs = async(req, res) => {
    try {

        const {userInfo} = req
        const blogs = await Blog.find({owner: userInfo._id})
        return res.status(200).json(200, {message: "User blogs recieved", blogs})
    }catch(error) {
        res.status(500).json(new apiResponse(500, {message: error.message}))
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    updateBlog,
    getMyBlogs
}






