import cookieParser from "cookie-parser";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { createStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePicture: randomAvatar,
    });

    try {
      await createStreamUser({
        id: newUser._id,
        name: newUser.fullName,
        image: newUser.profilePicture || "",
      });
      console.log(`Stream user created successfully for ${newUser._id}`);
    } catch (error) {
      console.error("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email does not match" });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res
      .status(200)
      .json({ success: true, message: "Login successful", user: user });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, nativeLanguage, learningLanguage, location, bio } =
      req.body;
    if (!nativeLanguage || !learningLanguage || !location || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      await createStreamUser({
        id: user._id,
        name: user.fullName,
        image: user.profilePicture || "",
      });
      console.log(`Stream user created successfully for ${user.fullName}`);
    } catch (error) {
      console.error("Error creating Stream user:", error);
    }

    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error) {
    console.log("Error in onboarding:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
