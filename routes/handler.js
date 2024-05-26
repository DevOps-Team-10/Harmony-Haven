const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const productController = require('../controllers/products/productcontroller');
const orderController = require('../controllers/products/ordercontroller');
const reviewController = require('../controllers/products/reviewController');

const path = require('path');
const bodyParser = require('body-parser')
const middleware = require('../middleware/token')

const multer = require('multer'); 

console.log('Initializing Routes...');


// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });


router.get('/', (req, res) => {
  res.json({"Success" :  "Backend hit successfully 1"});
});

//Register user
router.post('/user/register',userController.createUser);

//user login
router.post('/user/login',userController.loginUser);

//Create Product
router.post('/user/createProduct', middleware.authenticateToken, upload.single('image'), productController.createProduct);

//show all the products
router.get('/user/product',middleware.authenticateToken,productController.getProducts)

// get the specific product details
router.get('/user/product/:id',middleware.authenticateToken,productController.fetchProduct)

// delete the product, But will Confirm that the owner before deleting
router.delete('/user/product/:id',middleware.authenticateToken,productController.deleteProduct)
 
// Update The Product Details
router.put('/user/product/update/:id',middleware.authenticateToken,productController.updateProduct);

//order the product
router.post('/user/order/product/:id',middleware.authenticateToken,orderController.orderItems);

//Rating the Product
router.post('/user/rating/product/:id',middleware.authenticateToken,reviewController.reviewProduct)


module.exports = router;
