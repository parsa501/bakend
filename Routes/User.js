import express from "express";
import { checkAuth, login, Singup, updateProfile } from "../Controllers/UserCn.js";
import { protectRoute } from "../Middleware/auth.js";

const userRouter = express.Router();
userRouter.route("/singup").post(Singup);
userRouter.route("/login").post(login);
userRouter.route("/update-profile").put(protectRoute, updateProfile);
userRouter.route("/check").get(protectRoute, checkAuth);
export default userRouter;
