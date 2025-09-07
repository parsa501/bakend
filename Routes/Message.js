import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../Controllers/MessageCn.js";
import { protectRoute } from "../Middleware/auth.js";

const messageRouter = express.Router();
messageRouter.route("/users").get(protectRoute, getUsersForSidebar);
messageRouter.route("/:id").get(protectRoute, getMessages);
messageRouter.route("/mark/:id").put(protectRoute, markMessageAsSeen);
messageRouter.route("/send/:id").post(protectRoute, sendMessage);
export default messageRouter;
