require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userProfileRoutes = require("./routes/UserProfile");
const socketAuthMiddleware = require("./middleware/socketAuthMiddleware");
const { dbConnectMongoose, dbConnectMongoClient } = require("./db");
const { updateUserStatus } = require("./utils/userStatus");
const friendRoutes = require('./routes/friendRoutes');
const todoRoutes = require('./routes/todoRoutes');
const chatRoutes = require('./routes/chatRoutes');
const morgan = require('morgan');
const { saveMessage } = require('./controllers/chatController');

const app = express();
const PORT = process.env.PORT || 3000;

// Creating an HTTP server and passing the Express app to it
const server = require("http").createServer(app);

// Passing the server to socket.io
// Server-side CORS configuration for Express and Socket.IO
const corsOptions = {
  origin: "http://localhost:8080", // or '*' for all origins
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const io = require('socket.io')(server, {
  cors: corsOptions
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log requests to the console.

// Route handlers
app.use("/api", authRoutes);
app.use("/api", userProfileRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/chat", chatRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
dbConnectMongoose();
dbConnectMongoClient();

// Socket.IO middleware and configuration
io.use(socketAuthMiddleware);
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}, User ID: ${socket.userId}`);

  // Update user status to 'online' upon connection
  updateUserStatus(socket.userId, "online").catch((err) => console.error(err));

  socket.on('chatMessage', async (messageData) => {
    try {
      // Save the message to the database
      const savedMessage = await saveMessage(messageData);
      // Emit the message to the recipient
      io.to(messageData.recipient).emit('chatMessage', savedMessage);
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}, User ID: ${socket.userId}`);
    // Update user status to 'offline' upon disconnection
    updateUserStatus(socket.userId, "offline").catch((err) => console.error(err));
  });

  socket.on("updateStatus", (status) => {
    // This allows for manual status updates
    updateUserStatus(socket.userId, status).catch((err) => console.error(err));
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Use server.listen instead of app.listen to start the server with Socket.IO integration
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
