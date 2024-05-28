const mongoose = require('mongoose')

const createCommunitySchema = mongoose.Schema({
   communityName:{
    type: String,
    required:true
   },

   owner:{
    type:mongoose.Schema.Types.ObjectId,
    required : true
   }
});

const messageSchema = mongoose.Schema({
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    userContent: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

const Community = mongoose.model('Community',createCommunitySchema);
const Message = mongoose.model('Message',messageSchema)

module.exports= {
    Community,
    Message
}