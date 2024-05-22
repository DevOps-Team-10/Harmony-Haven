const jwt = require('jsonwebtoken');


const createToken = (userName,userEmail)=>{
    return jwt.sign({ name:userName , email:userEmail }, process.env.SECRET_KEY, { expiresIn: '1h' });
}

const validateToken=()=>{

}

function authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
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

