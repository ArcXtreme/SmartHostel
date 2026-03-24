const express = require("express");
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.patch("/student/availability", requireAuth(["student"]), async (req, res) => {
  try {
    const { availabilityNote } = req.body;
    const doc = await User.findByIdAndUpdate(
      req.user._id,
      { availabilityNote: String(availabilityNote || "").trim() },
      { new: true }
    ).select("-passwordHash");
    res.json({ user: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
