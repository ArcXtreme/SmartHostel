const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const MessFeedback = require("../models/MessFeedback");
const { makeUploader } = require("../middleware/upload");

const router = express.Router();
const upload = makeUploader("mess", { maxCount: 1, maxSizeMb: 8 });

router.post("/mess-feedback", requireAuth(["student"]), (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    try {
      const breakfast = Number(req.body.breakfast);
      const lunch = Number(req.body.lunch);
      const dinner = Number(req.body.dinner);
      const comment = String(req.body.comment || "").trim();
      if (![breakfast, lunch, dinner].every((n) => n >= 1 && n <= 5)) {
        return res.status(400).json({ message: "Breakfast, lunch, dinner ratings 1-5 required" });
      }
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/mess/${path.basename(req.file.path)}`;
      }
      const row = await MessFeedback.create({
        studentId: req.user._id,
        breakfast,
        lunch,
        dinner,
        comment,
        image: imagePath,
      });
      res.status(201).json({ feedback: row });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  });
});

router.get("/mess-feedback/my", requireAuth(["student"]), async (req, res) => {
  try {
    const rows = await MessFeedback.find({ studentId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ feedback: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/mess-feedback/all", requireAuth(["admin"]), async (req, res) => {
  try {
    const rows = await MessFeedback.find()
      .sort({ createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName email")
      .limit(200)
      .lean();
    res.json({ feedback: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
