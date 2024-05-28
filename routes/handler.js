const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const productController = require('../controllers/products/productcontroller');
const orderController = require('../controllers/products/ordercontroller');
const reviewController = require('../controllers/products/reviewController');
const communityController = require ('../controllers/communityController');
const messageController = require('../controllers/messageController')

// Import the getConsultants function
const { getConsultants } = require('../controllers/getConsultants');

const path = require('path');
const bodyParser = require('body-parser')
const middleware = require('../middleware/token')

const multer = require('multer'); 

console.log('Initializing Routes...');


// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });


router.get('/', (req, res) => {
  res.json({"Success" :  "200"});
});

// Register user
router.post('/user/register', userController.createUser);

// User login
router.post('/user/login', userController.loginUser);

//Create Product
router.post('/user/createProduct', middleware.authenticateToken, upload.single('image'), productController.createProduct);

// Show all the products
router.get('/user/product', middleware.authenticateToken, productController.getProducts);

// Get the specific product details
router.get('/user/product/:id', middleware.authenticateToken, productController.fetchProduct);

// get the specific product details
router.get('/user/product/:id',middleware.authenticateToken,productController.fetchProduct)

// delete the product, But will Confirm that the owner before deleting
router.delete('/user/product/:id',middleware.authenticateToken,productController.deleteProduct)
 
// Update The Product Details
router.put('/user/product/update/:id',middleware.authenticateToken,productController.updateProduct);

//order the product
router.post('/user/order/products',middleware.authenticateToken,orderController.orderItems);

//Rating the Product
router.post('/user/rating/product/:id',middleware.authenticateToken,reviewController.reviewProduct)

// Route for consultants
router.get('/user/consultants', getConsultants);

// Create Community
router.post('/api/community',middleware.authenticateToken,communityController.createCommunity)

//Show the Community
router.get('/api/community',middleware.authenticateToken,communityController.getCommunity)

router.get('/api/community/:id/messages', middleware.authenticateToken,messageController.fetchMessage)

router.post('/api/community/:id/messages', middleware.authenticateToken, messageController.postMessage);


module.exports = router;
