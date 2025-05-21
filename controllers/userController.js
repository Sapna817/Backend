import User from "../models/user.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-Password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const updateData = req.body;
    if (updateData.Password) {
      updateData.Password = await bcrypt.hash(updateData.Password, 10);
    }

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "users",
      });
      updateData.profilePic = uploadRes.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-Password");
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-Password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};