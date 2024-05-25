require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const connectToDB = require('./config/db');
const logger = require('./middleware/logger');
const routesHandler = require('./routes/handler');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


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

const PORT = process.env.PORT || 5005;


// Swagger options
const options = {
  swaggerDefinition: {
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your RESTful API',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
