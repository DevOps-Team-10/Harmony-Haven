const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.post('/register', (req, res) => {
  // Extract registration data from the request body
  const { username, email, password } = req.body;

  console.log(req.body)

  // Here you can perform validation, save the user to the database, etc.

  // For now, let's just send back a success response
  res.status(200).json({ message: 'User registered successfully' });
});
         
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'about.html'));
});

router.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'));
});

module.exports = router;
