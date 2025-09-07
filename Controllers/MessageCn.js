import { catchAsync } from "vanta-api";
import User from "../Models/UserMd.js";
import Message from "../Models/Message.js";
import { io, userSocketMap } from "../server.js";

//Get all user exceot the logged in user
export const getUsersForSidebar = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const filterUsers = await User.find({ _id: { $ne: userId } }).select(
    "-password"
  );
  const unseenMessages = {};
  const promises = filterUsers.map(async (user) => {
    const message = await Message.find({
      senderId: user._id,
      receiverId: userId,
      seen: false,
    });
    if (message.length > 0) {
      unseenMessages[user._id] = message.length;
    }
  });
  await Promise.all(promises);
  return res.status(200).json({
    success: true,
    users: filterUsers,
    unseenMessages,
  });
});

//get all message for selected user
export const getMessages = catchAsync(async (req, res, next) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user._id;
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: selectedUserId },
      { senderId: selectedUserId, receiverId: myId },
    ],
  });
  await Message.updateMany(
    { senderId: selectedUserId, receiverId: myId },
    { seen: true }
  );
  return res.status(200).json({
    success: true,
    messages,
  });
});

// api to mark message as seen using message id
export const markMessageAsSeen = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Message.findByIdAndUpdate(id, { seen: true });
  return res.status(200).json({
    success: true,
  });
});

// Send message to selected user
export const sendMessage = catchAsync(async (req, res, next) => {
  const { text, image } = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  // Emit the new message to the receiver's socket
  const receiverSocketId = userSocketMap[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res.status(200).json({
    success: true,
    newMessage,
  });
});
