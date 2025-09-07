import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
    },
    fullName: {
      type: String,
      required: [true, "Password is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
