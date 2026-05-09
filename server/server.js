require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Track online users: { userId: socketId }
const onlineUsers = new Map();

// Socket.io events
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log(`User ${userId} connected (${socket.id})`);
  }

  // Real-time chat
  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", message);
    }
  });

  // Typing indicator
  socket.on("typing", ({ receiverId, senderName }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", { senderName });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userStoppedTyping");
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} disconnected`);
    }
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.send("ReCart API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
