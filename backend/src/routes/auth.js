const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, requireAuth, toPublicUser } = require("../middleware/auth");

const router = express.Router();

function validateEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/signup/student", async (req, res) => {
  try {
    const { name, rollNumber, email, password, hostelName, roomNumber } = req.body;
    if (!name || !rollNumber || !email || !password || !hostelName || !roomNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: "student",
      name: String(name).trim(),
      rollNumber: String(rollNumber).trim(),
      email: String(email).trim().toLowerCase(),
      passwordHash,
      hostelName: String(hostelName).trim(),
      roomNumber: String(roomNumber).trim(),
    });
    const token = signToken(user);
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate hostel/room or email" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup/admin", async (req, res) => {
  try {
    const { name, idNumber, email, password } = req.body;
    if (!name || !idNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existsE = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existsE) return res.status(409).json({ message: "Email already registered" });
    const existsId = await User.findOne({ idNumber: String(idNumber).trim() });
    if (existsId) return res.status(409).json({ message: "Admin ID already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: "admin",
      name: String(name).trim(),
      idNumber: String(idNumber).trim(),
      email: String(email).trim().toLowerCase(),
      passwordHash,
    });
    const token = signToken(user);
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup/worker", async (req, res) => {
  try {
    const { name, workerId, password } = req.body;
    if (!name || !workerId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const exists = await User.findOne({ workerId: String(workerId).trim() });
    if (exists) return res.status(409).json({ message: "Worker ID already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: "worker",
      name: String(name).trim(),
      workerId: String(workerId).trim(),
      passwordHash,
    });
    const token = signToken(user);
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { role, email, workerId, password } = req.body;
    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required" });
    }
    let user;
    if (role === "worker") {
      if (!workerId) return res.status(400).json({ message: "Worker ID is required" });
      user = await User.findOne({ role: "worker", workerId: String(workerId).trim() });
    } else if (role === "student" || role === "admin") {
      if (!email) return res.status(400).json({ message: "Email is required" });
      const em = String(email).trim().toLowerCase();
      user = await User.findOne({ role, email: em });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth(), async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

module.exports = router;
