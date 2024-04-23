require('dotenv').config()

const express = require('express');
const routesHandler=require('./routes/handler.js');
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error=>console.error(error)))
db.once('open',()=> console.log('Connected to Database'))

app.use(express.json())

app.use('/',routesHandler);

const PORT = process.env.PORT || 5000;  // backend routing port  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
