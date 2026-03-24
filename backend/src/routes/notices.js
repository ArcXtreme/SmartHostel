const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Notice = require("../models/Notice");
const { notifyUsersByRole } = require("../utils/notify");

const router = express.Router();

router.post("/notices", requireAuth(["admin"]), async (req, res) => {
  try {
    const { audience, title, body } = req.body;
    if (!audience || !["students", "workers"].includes(audience)) {
      return res.status(400).json({ message: "Audience students or workers required" });
    }
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body required" });
    }
    const notice = await Notice.create({
      adminId: req.user._id,
      audience,
      title: String(title).trim(),
      body: String(body).trim(),
    });

    const role = audience === "students" ? "student" : "worker";
    await notifyUsersByRole(
      role,
      `New notice: ${notice.title}`,
      "notice",
      { noticeId: notice._id }
    );

    const populated = await Notice.findById(notice._id).populate("adminId", "name").lean();
    res.status(201).json({ notice: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/notices", async (req, res) => {
  try {
    const { audience } = req.query;
    const q = {};
    if (audience) q.audience = audience;
    const notices = await Notice.find(q)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("adminId", "name")
      .lean();
    res.json({ notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
