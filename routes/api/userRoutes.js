import express from "express";
import User from "../../models/User.js";
import { signToken } from "../../utils/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required." });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingEmail) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const valid = await user.isCorrectPassword(password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured." });
    }

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

export default router;
