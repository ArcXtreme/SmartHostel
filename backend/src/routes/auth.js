const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, requireAuth, toPublicUser } = require("../middleware/auth");
const PasswordResetOtp = require("../models/PasswordResetOtp");
const { sendMail } = require("../utils/email");

const router = express.Router();

function validateEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRollNumber(rollNumber) {
  return typeof rollNumber === "string" && /^[0-9]{4}[a-z]{3}[0-9]{4}$/.test(rollNumber);
}

function validateHostelName(hostelName) {
  return ["Chenab", "Raavi", "Beas", "Satluj", "Brahmaputra"].includes(String(hostelName || "").trim());
}

router.post("/signup/student", async (req, res) => {
  try {
    const { name, rollNumber, email, password, hostelName, roomNumber } = req.body;
    if (!name || !rollNumber || !email || !password || !hostelName || !roomNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateRollNumber(rollNumber)) {
      return res.status(400).json({ message: "Invalid roll number format" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!validateHostelName(hostelName)) {
      return res.status(400).json({ message: "Invalid hostel name" });
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
      return res.status(409).json({ message: "Email already registered" });
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
    const { name, workerId, email, password } = req.body;
    if (!name || !workerId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const exists = await User.findOne({ workerId: String(workerId).trim() });
    if (exists) return res.status(409).json({ message: "Worker ID already registered" });
    const existsE = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existsE) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: "worker",
      name: String(name).trim(),
      workerId: String(workerId).trim(),
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

router.post("/login", async (req, res) => {
  try {
    const { email, workerId, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Role is determined from stored user record (no role re-prompt after Sign In).
    let user = null;
    if (email) {
      const em = String(email).trim().toLowerCase();
      user = await User.findOne({ email: em });
    } else if (workerId) {
      user = await User.findOne({ workerId: String(workerId).trim() });
    } else {
      return res.status(400).json({ message: "Email is required" });
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

router.post("/forgot-password/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) return res.status(400).json({ message: "Valid email is required" });
    const em = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: em }).select("_id email");
    // Do not reveal whether email exists.
    if (!user) return res.json({ message: "If the email is registered, an OTP has been sent" });

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
    const otpHash = await bcrypt.hash(otp, 10);
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
    const expiresAt = new Date(Date.now() + Math.max(5, Math.min(10, ttlMinutes)) * 60 * 1000);

    await PasswordResetOtp.create({ email: em, otpHash, expiresAt });

    await sendMail({
      to: em,
      subject: "SmartHostel Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP expires in ${Math.round((expiresAt.getTime() - Date.now()) / 60000)} minutes.`,
    });

    res.json({ message: "If the email is registered, an OTP has been sent" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!validateEmail(email)) return res.status(400).json({ message: "Valid email is required" });
    const code = String(otp || "").trim();
    if (!/^[0-9]{6}$/.test(code)) return res.status(400).json({ message: "Valid 6-digit OTP is required" });

    const em = String(email).trim().toLowerCase();
    const doc = await PasswordResetOtp.findOne({ email: em, consumedAt: null, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 });
    if (!doc) return res.status(400).json({ message: "Invalid or expired OTP" });

    const ok = await bcrypt.compare(code, doc.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP verified" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!validateEmail(email)) return res.status(400).json({ message: "Valid email is required" });
    const code = String(otp || "").trim();
    if (!/^[0-9]{6}$/.test(code)) return res.status(400).json({ message: "Valid 6-digit OTP is required" });
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const em = String(email).trim().toLowerCase();
    const doc = await PasswordResetOtp.findOne({ email: em, consumedAt: null, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 });
    if (!doc) return res.status(400).json({ message: "Invalid or expired OTP" });

    const ok = await bcrypt.compare(code, doc.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({ email: em }, { passwordHash }, { new: true });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    doc.consumedAt = new Date();
    await doc.save();

    res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
