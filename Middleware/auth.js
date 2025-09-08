import { catchAsync, HandleERROR } from "vanta-api";
import jwt from "jsonwebtoken";
import User from "../Models/UserMd.js";
export const protectRoute = catchAsync(async (req, res,next) => {
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    next(new HandleERROR("user not found", 404));
  }
  req.user = user;
  next();
});
