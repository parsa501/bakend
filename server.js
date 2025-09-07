import app, { __dirname } from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

dotenv.config({ path: `${__dirname}/config.env` });

const port = process.env.PORT || 5000;

// create http server
const server = http.createServer(app);

// setup socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// connect mongoose
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection failed:", error));

// start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
