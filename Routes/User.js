/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management & authentication
 */

/**
 * @swagger
 * /api/auth/singup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - bio
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Ali Ahmadi
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               bio:
 *                 type: string
 *                 example: Software Engineer
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Missing details or validation error
 *       404:
 *         description: Account already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilepic:
 *                 type: string
 *                 example: "base64ImageString"
 *               bio:
 *                 type: string
 *                 example: New bio
 *               fullName:
 *                 type: string
 *                 example: Ali NewName
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/check:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user info
 *       401:
 *         description: Unauthorized
 */

import express from "express";
import { checkAuth, login, Singup, updateProfile } from "../Controllers/UserCn.js";
import { protectRoute } from "../Middleware/auth.js";

const userRouter = express.Router();
userRouter.route("/singup").post(Singup);
userRouter.route("/login").post(login);
userRouter.route("/update-profile").put(protectRoute, updateProfile);
userRouter.route("/check").get(protectRoute, checkAuth);
export default userRouter;
