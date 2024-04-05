require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/UserProfile');
const socketAuthMiddleware = require('./middleware/socketAuthMiddleware');
const { dbConnectMongoose, dbConnectMongoClient } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Creating an HTTP server and passing the Express app to it
const server = require('http').createServer(app);

// Passing the server to socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userProfileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
dbConnectMongoose();
dbConnectMongoClient();

io.use(socketAuthMiddleware)

// Apply the middleware to all incoming Socket.IO connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}, User ID: ${socket.userId}`);
  
  // Update user status to 'online' upon connection
  updateUserStatus(socket.userId, 'online');

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}, User ID: ${socket.userId}`);
    // Update user status to 'offline' upon disconnection
    updateUserStatus(socket.userId, 'offline');
  });

  socket.on('updateStatus', async (status) => {
    // This allows for manual status updates, e.g., setting to 'away'
    updateUserStatus(socket.userId, status);
  });
}); 

console.log

const User = require('./models/User'); // Adjust the path as necessary

const updateUserStatus = async (userId, status) => {
  console.log(`Attempting to update user ${userId} to status: ${status}`);
  try {
    const result = await User.findByIdAndUpdate(userId, { status: status }, { new: true });
    console.log(`Update result:`, result);
  } catch (error) {
    console.error(`Error updating user ${userId} status to ${status}:`, error);
  }
};









// Use server.listen instead of app.listen to start the server with Socket.IO integration
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
