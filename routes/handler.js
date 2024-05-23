const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const productController = require('../controllers/products/productcontroller');

const path = require('path');
const bodyParser = require('body-parser')
const middleware = require('../middleware/token')

console.log('Initializing Routes...');


router.get('/', (req, res) => {
  res.json({"Success" :  "Backend hit successfully "});
});

//Register user
router.post('/user/register',userController.createUser);

//user login
router.post('/user/login',userController.loginUser);

//Create Product
router.post('/user/createProduct',middleware.authenticateToken,productController.createProduct)

//show all the products
router.get('/user/product',middleware.authenticateToken,productController.getProducts)

// get the specific product details
router.get('/user/product/:id',middleware.authenticateToken,productController.fetchProduct)
         

module.exports = router;
