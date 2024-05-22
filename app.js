require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const connectToDB = require('./config/db');
const logger = require('./middleware/logger');
const routesHandler = require('./routes/handler');


const app = express();

// Connect to Database
console.log('setting up Database...');
connectToDB();

console.log('Setting up Middleware...');
// Middleware
app.use(express.json());
app.use(logger); // Custom logger middleware

console.log('Setting up Routes...');
// Routes
app.use('/', routesHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
