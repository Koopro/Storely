// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ message: 'Authentication failed!' });

// Inside authMiddleware, ensure you're setting userData correctly
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.sendStatus(403); // Token verification failed
  req.userData = { userId: decoded.userId };
  next();
});
};


module.exports = authMiddleware;
