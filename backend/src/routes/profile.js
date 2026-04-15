const express = require("express");
const { requireAuth, toPublicUser } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", requireAuth(), async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

router.patch("/profile", requireAuth(), async (req, res) => {
  try {
    const { name, hostelName, roomNumber, email } = req.body || {};
    const patch = {};

    if (typeof name === "string") patch.name = name.trim();
    if (typeof hostelName === "string") patch.hostelName = hostelName.trim();
    if (typeof roomNumber === "string") patch.roomNumber = roomNumber.trim();
    if (typeof email === "string") patch.email = email.trim().toLowerCase();

    // rollNumber must not be editable
    delete patch.rollNumber;

    const updated = await User.findByIdAndUpdate(req.user._id, patch, { new: true }).select("-passwordHash");
    res.json({ user: updated });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Email already registered" });
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

