const { Message } = require('../models/communityModel');
const APIResponse = require('../utils/apiResponse.js');
const User = require('../models/userModel.js');

const fetchMessage = async (req, res) => {
    try {
        const messages = await Message.find({ communityId: req.params.id })
            .populate({
                path: 'userId',
                select: 'name' // Select only the username field from the populated user
            })
            .sort('timestamp');
        return res.status(200).json(new APIResponse(200, 'Messages Fetched Successfully', messages));
    } catch (error) {
        return res.status(500).json(new APIResponse(500, 'Error Fetching Message', { error: error.message }));
    }
};

const postMessage = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.userInfo.email });
        const newMessage = new Message({
            communityId: req.params.id,
            userId: user._id,
            userContent: req.body.userContent,
        });
        await newMessage.save();
        
        // Populate the userId field in the newMessage object with the user's name
        await newMessage.populate('userId', 'name');
        
        return res.status(200).json(new APIResponse(200, 'Message Sent Successfully', newMessage));
    } catch (error) {
        return res.status(500).json(new APIResponse(500, 'Error Sending Message', { error: error.message }));
    }
};



module.exports = {
    fetchMessage,
    postMessage
};
