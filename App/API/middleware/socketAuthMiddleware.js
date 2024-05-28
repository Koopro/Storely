const jwt = require('jsonwebtoken');

// Function to authenticate Socket.IO connections
const socketAuthMiddleware = (socket, next) => {
  // Assuming the token is sent through the query parameter
  const token = socket.handshake.query.token;

  if (!token) {
    const error = new Error('Authentication error: Token missing');
    console.error(error.message);
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const error = new Error('Authentication error: Invalid token');
      console.error(error.message);
      return next(error);
    }
    console.log(`Authenticated userId: ${decoded.userId}`);
    // If the token is valid, attach the decoded userId to the socket for future use
    socket.userId = decoded.userId;
    next();
  });
};

module.exports = socketAuthMiddleware;
