import bcryptjs from "bcryptjs";
import { catchAsync, HandleERROR } from "vanta-api";
import User from "../Models/UserMd.js";
import { generateToken } from "../Utils/Utils.js";
import cloudinary from "../Utils/cloudinary.js";

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
  const userData = await User.findOne({ email });
  const isPasswordCorrent = await bcryptjs.compare(password, userData.password);

  if (!isPasswordCorrent) {
    return next(new HandleERROR("Invalid credentials", 404));
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
export const checkAuth = (req, res, next) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = catchAsync(async (req, res, next) => {
  const { profilepic, bio, fullName } = req.body;
  const userId = req.user._id;
  let updateUser;
  if (!profilepic) {
    await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
  } else {
    const upload = await cloudinary.uploader.upload(profilepic);
    updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: upload.secure_url, bio, fullName },
      { new: true }
    );
  }
  return res.status(203).json({
    success: true,
    user: updateUser,
  });
});
