const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { roomNumber, password, role } = req.body;
    if (!roomNumber || !password) {
      return res.status(400).json({ message: "Room number and password are required" });
    }

    const existing = await User.findOne({ roomNumber });
    if (existing) {
      return res.status(409).json({ message: "Room already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      roomNumber,
      passwordHash,
      role: role === "worker" ? "worker" : "student",
    });

    return res.status(201).json({
      message: "Signup successful",
      user: { roomNumber: user.roomNumber, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { roomNumber, password, role } = req.body;
    if (!roomNumber || !password) {
      return res.status(400).json({ message: "Room number and password are required" });
    }

    const user = await User.findOne({ roomNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    return res.json({
      message: "Login successful",
      user: { roomNumber: user.roomNumber, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

