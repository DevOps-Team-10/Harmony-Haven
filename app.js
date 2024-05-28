require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const {Message} = require('./models/communityModel')
const cors = require('cors');
const http = require('http'); 



const connectToDB = require('./config/db');
const logger = require('./middleware/logger');
const routesHandler = require('./routes/handler');




const app = express();
const socketIo = require('socket.io');
const server = http.createServer(app); 
const io = socketIo(server);


// Connect to Database
console.log('setting up Database...');
connectToDB();

//allow cross origin
app.use(cors());

console.log('Setting up Middleware...');
// Middleware
app.use(express.json());
app.use(logger); // Custom logger middleware

console.log('Setting up Routes...');
// Routes
app.use('/', routesHandler);

const PORT = process.env.PORT || 5005;


// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (message) => {
    try {
      const newMessage = new Message({
        communityId: message.communityId,
        userId: message.userId,
        userContent: message.userContent,
      });
      await newMessage.save();
      io.emit('message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
