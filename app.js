require('dotenv').config();
const cookieParser = require('cookie-parser')
const express = require('express');
const mongoose = require('mongoose');

const {Message} = require('./models/communityModel')
const cors = require('cors');
const http = require('http'); 
const socketIo = require('socket.io');

const connectToDB = require('./config/db');
const logger = require('./middleware/logger');
const routesHandler = require('./routes/handler');



const app = express();

const server = http.createServer(app); 
const io = socketIo(server);


connectToDB();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(logger); // Custom logger middleware


app.use('/', routesHandler);

const PORT = process.env.PORT || 5005;


// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected , ID: ${socket.id}`);
  

  socket.on('sendMessage', async (message) => {
    try {
      // const newMessage = new Message({
      //   communityId: message.communityId,
      //   userId: message.userId,
      //   userContent: message.userContent,
      // });
      //await newMessage.save();
      io.emit('message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected , id :${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
