const jwt = require('jsonwebtoken');
const APIReponse = require('../utils/apiResponse');


const createToken = (userName,userEmail)=>{
    return jwt.sign({ name:userName , email:userEmail }, process.env.SECRET_KEY, { expiresIn: '24h' });
}



function authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.status(401).json(new APIReponse(401,"Authorization token is not passed"));
      }
  
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        // providing the data used to encode the message , so can use it later
        req.userInfo = user;
        next();
      });
    } catch (error) {
      res.status(500).json({ message: 'Error authenticating token' });
    }
  }

module.exports= {
    createToken,
    authenticateToken
}

