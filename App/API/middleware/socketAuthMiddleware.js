const jwt = require('jsonwebtoken');

// Function to authenticate Socket.IO connections
const socketAuthMiddleware = (socket, next) => {
  // Assuming the token is sent through the query parameter
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    console.log(`Authenticated userId: ${socket.userId}`);
    // If the token is valid, attach the decoded userId to the socket for future use
    socket.userId = decoded.userId;
    next();
  });
};

module.exports = socketAuthMiddleware;
