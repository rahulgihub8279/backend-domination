import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    
  } catch (err) {
    console.log(err.message);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
      return res.status(400).json({
        message: "all fields are required !",
      });
    }
    const existUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "username or email already exist" });
    }
    const avatarPath = req.files?.avatar[0]?.path;
    const coverPath = req.files?.coverImage
      ? req.files?.coverImage[0]?.path
      : "";
    if (!avatarPath) {
      return res.status(400).json({ message: "avatar is required" });
    }
    const avatarCloudinary = await uploadOnCloudinary(avatarPath);
    let coverCloudinary;
    if (coverPath) {
      coverCloudinary = await uploadOnCloudinary(coverPath);
    }

    if (!avatarCloudinary) {
      return res.status(500).json({
        message: "Avatar upload failed",
      });
    }
    const newUser = await User.create({
      fullname,
      email,
      username,
      password,
      avatar: avatarCloudinary?.url,
      coverImage: coverCloudinary?.url || "",
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(500).json({
        message: "server error",
      });
    }
    return res.status(201).json(createdUser);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const loginUSer = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!username || !email) {
      return res.status(400).json({
        message: "username or email is required !",
      });
    }
    const existUser = await User.findById({
      $or: [{ email }, { username }],
    });
    if (!existUser) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const isPasswordValid = await User.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "incorrect password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
