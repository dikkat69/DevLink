require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

const app = express();
const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// Initialize Socket.IO server
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database Connected");
    server.listen(process.env.PORT, () => {
      console.log("Server is running on http://localhost:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed", err);
  });