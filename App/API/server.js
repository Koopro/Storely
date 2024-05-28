require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userProfileRoutes = require("./routes/UserProfile");
const friendRoutes = require('./routes/friendRoutes');
const todoRoutes = require('./routes/todoRoutes');
const eventRoutes = require('./routes/eventRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Import the new chat routes
const socketAuthMiddleware = require("./middleware/socketAuthMiddleware");
const { dbConnectMongoose, dbConnectMongoClient } = require("./db");
const { updateUserStatus } = require("./utils/userStatus");
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const Chat = require('./models/Chat'); // Import Chat model
const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 3000;

const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
  }
});

app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use("/api", authRoutes);
app.use("/api", userProfileRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api", todoRoutes);
app.use("/api", eventRoutes);
app.use("/api", chatRoutes); // Use the new chat routes

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const chatId = req.headers['chat-id'];
    const dir = `uploads/${chatId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const chatId = req.headers['chat-id'];
    res.json({ url: `/uploads/${chatId}/${req.file.filename}`, type: req.file.mimetype });
  } else {
    res.status(400).send('No file uploaded');
  }
});

dbConnectMongoose();
dbConnectMongoClient();

const userSocketMap = new Map();

io.use(socketAuthMiddleware);
io.on("connection", (socket) => {
  const userId = socket.userId;
  userSocketMap.set(userId, socket.id);

  console.log(`User connected: ${socket.id}, User ID: ${userId}`);

  updateUserStatus(userId, "online").catch((err) => console.error(err));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}, User ID: ${userId}`);
    userSocketMap.delete(userId);
    updateUserStatus(userId, "offline").catch((err) => console.error(err));
  });

  socket.on("updateStatus", (status) => {
    updateUserStatus(userId, status).catch((err) => console.error(err));
  });

  socket.on("joinChat", async ({ chatId }) => {
    console.log(`User ${userId} joining chat: ${chatId}`);
    socket.join(chatId);

    try {
      let chat = await Chat.findOne({ chatId });
      if (!chat) {
        console.log(`Chat not found with ID: ${chatId}, creating new chat.`);
        chat = new Chat({ chatId, messages: [] });
        await chat.save();
        console.log(`Chat created with ID: ${chatId}`);
      } else {
        console.log(`Chat found with ID: ${chatId}`);
      }
      socket.emit("loadOldMessages", chat.messages);
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit("error", { message: "Error joining chat." });
    }
  });

  socket.on("sendMessage", async ({ chatId, userId, text, mediaUrl, mediaType }) => {
    try {
      const user = await User.findById(userId);
      const username = user ? user.username : 'Unknown';
      const message = { text, userId, username, index: Date.now(), mediaUrl, mediaType };

      console.log(`Received message: ${JSON.stringify(message)}`); // Log the received message

      const chat = await Chat.findOneAndUpdate(
          { chatId },
          { $push: { messages: message } },
          { new: true, upsert: true }
      );

      io.to(chatId).emit("message", message); // Broadcast to all clients in the room
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit("error", { message: "Error sending message." });
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
