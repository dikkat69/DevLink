const socketIO = require("socket.io");
const { verifyToken } = require("../Middlewares/auth");
const Chat = require("../models/Chat");
const ConnectionRequest = require("../models/ConnectRequest");

const parseCookies = (cookieStr) => {
  if (!cookieStr) return {};
  return cookieStr.split(';').reduce((acc, c) => {
    const [name, ...val] = c.trim().split('=');
    if (name) acc[name] = val.join('=');
    return acc;
  }, {});
};

const initializeSocket = (server) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const io = socketIO(server, {
    cors: {
      origin: frontendUrl,
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies = parseCookies(cookieHeader);
      const token = cookies.token;
      
      if (!token) {
        return next(new Error("Authentication failed: No token provided"));
      }

      const user = await verifyToken(token);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed: " + err.message));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected to socket: " + socket.user._id);

    // Join a chat room
    socket.on("joinChat", ({ targetUserId }) => {
      if (!targetUserId) return;
      const userId = socket.user._id.toString();
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
      console.log(`Socket ${userId} joined room ${roomId}`);
    });

    // Send a message
    socket.on("sendMessage", async ({ targetUserId, text }) => {
      try {
        if (!targetUserId || !text || !text.trim()) return;

        const userId = socket.user._id;

        // Verify connection status
        const isConnected = await ConnectionRequest.areConnected(userId, targetUserId);
        if (!isConnected) {
          console.error(`Blocked sendMessage: Users ${userId} and ${targetUserId} are not connected.`);
          return;
        }

        // Find or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        chat.messages.push({
          senderId: userId,
          text: text.trim()
        });

        await chat.save();

        // Populate sender info for broadcasting
        const populatedChat = await Chat.findById(chat._id)
          .populate("messages.senderId", "firstName lastName photoUrl");
        
        const savedMessage = populatedChat.messages[populatedChat.messages.length - 1];

        // Emit message to room
        const roomId = [userId.toString(), targetUserId.toString()].sort().join("_");
        io.to(roomId).emit("messageReceived", savedMessage);
      } catch (err) {
        console.error("Error in socket sendMessage:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from socket: " + socket.user._id);
    });
  });
};

module.exports = initializeSocket;
