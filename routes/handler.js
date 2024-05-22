const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const productController = require('../controllers/products/createProduct');

const path = require('path');
const bodyParser = require('body-parser')
const middleware = require('../middleware/token')

console.log('Initializing Routes...');


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'about.html'));
});


router.post('/user/register',userController.createUser);
router.post('/user/login',userController.loginUser);

router.post('/user/createProduct',middleware.authenticateToken,productController.createProduct)
         

module.exports = router;
