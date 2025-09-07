/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Chat message management
 */

/**
 * @swagger
 * /api/messages/users:
 *   get:
 *     summary: Get all users except logged-in user + unseen messages count
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with unseen messages count
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get all messages between logged-in user and selected user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Selected user ID
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/messages/mark/{id}:
 *   put:
 *     summary: Mark a message as seen
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message marked as seen
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/messages/send/{id}:
 *   post:
 *     summary: Send a new message to a user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Receiver user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Hello, how are you?"
 *               image:
 *                 type: string
 *                 example: "base64ImageString"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 */

import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../Controllers/MessageCn.js";
import { protectRoute } from "../Middleware/auth.js";

const messageRouter = express.Router();
messageRouter.route("/users").get(protectRoute, getUsersForSidebar);
messageRouter.route("/:id").get(protectRoute, getMessages);
messageRouter.route("/mark/:id").put(protectRoute, markMessageAsSeen);
messageRouter.route("/send/:id").post(protectRoute, sendMessage);
export default messageRouter;
