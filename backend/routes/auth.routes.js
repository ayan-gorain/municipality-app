import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, photo } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    let photourl = "";
    if (photo) {
      const uploaded = await cloudinary.v2.uploader.upload(photo, {
        folder: "users",
      });
      photourl = uploaded.secure_url;
    }
    const user = new userModel({
      name,
      email,
      password: hashed,
      role,
      photourl,
    });
    await user.save();

    res.status(201).json({ message: "User Created Succesfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      photoUrl: user.photoUrl,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
