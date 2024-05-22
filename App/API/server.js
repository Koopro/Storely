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
const morgan = require('morgan');
const Chat = require('./models/Chat');
const User = require('./models/User');

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
app.use("/api/todo", todoRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

const multer = require('multer');
const fs = require('fs');
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

    const chat = await Chat.findOne({ chatId });
    if (chat) {
      socket.emit("loadOldMessages", chat.messages);
    }
  });

  socket.on("sendMessage", async ({ chatId, userId, text, mediaUrl, mediaType }) => {
    const user = await User.findById(userId);
    const username = user ? user.username : 'Unknown';
    const message = { text, userId, username, index: Date.now(), mediaUrl, mediaType };

    await Chat.findOneAndUpdate(
        { chatId },
        { $push: { messages: message } },
        { new: true, upsert: true }
    );

    console.log(`Broadcasting message to chat ${chatId}`);
    io.to(chatId).emit("message", message);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
