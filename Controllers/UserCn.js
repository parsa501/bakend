import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync, HandleERROR } from "vanta-api";
import User from "../Models/UserMd";
import { generateToken } from "../Utils/Utils";

// Singup a new User
export const Singup = catchAsync(async (req, res, next) => {
  const { fullName, email, password, bio } = req.body;
  if (!fullName || !email || !password || !bio) {
    return next(new HandleERROR("Missing Details", 400));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new HandleERROR("Account already exists", 404));
  }
  const salt = await bcryptjs.getSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);
  const newUser = await User.create({
    fullName,
    email,
    password: hashPassword,
    bio,
  });
  const token = generateToken(newUser._id);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    userData: newUser,
    token,
  });
});

//contoroller to login a user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const userData=await User.findOne({email})
  const isPasswordCorrent=await bcryptjs.compare(password,userData.password)

  if(!isPasswordCorrent){
    return next(new HandleERROR("Invalid credentials",404))
  }
    const token = generateToken(userData._id);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    userData,
    token,
  });
});

//controller to check if user is authenticated
