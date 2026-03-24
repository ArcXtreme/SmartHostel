const express = require("express");
const { requireAuth } = require("../middleware/auth");
const AppNotification = require("../models/AppNotification");

const router = express.Router();

router.get("/notifications", requireAuth(), async (req, res) => {
  try {
    const rows = await AppNotification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ notifications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/notifications/:id/read", requireAuth(), async (req, res) => {
  try {
    const updated = await AppNotification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ notification: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/notifications/mark-all-read", requireAuth(), async (req, res) => {
  try {
    await AppNotification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
