const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const LostFoundItem = require("../models/LostFoundItem");
const { makeUploader } = require("../middleware/upload");

const router = express.Router();
const upload = makeUploader("lostfound", { maxCount: 6, maxSizeMb: 8 });

router.post("/lost-found", requireAuth(["student"]), (req, res) => {
  upload.array("images", 6)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    try {
      const { type, description, location, collectAt } = req.body;
      if (!type || !["lost", "found"].includes(type)) {
        return res.status(400).json({ message: "Type lost or found required" });
      }
      if (!description || !location) {
        return res.status(400).json({ message: "Description and location required" });
      }
      const images = (req.files || []).map((f) => `/uploads/lostfound/${path.basename(f.path)}`);
      const item = await LostFoundItem.create({
        studentId: req.user._id,
        type,
        description: String(description).trim(),
        location: String(location).trim(),
        collectAt: String(collectAt || "").trim(),
        images,
      });
      res.status(201).json({ item });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  });
});

router.get("/lost-found", async (req, res) => {
  try {
    const items = await LostFoundItem.find({ resolved: false })
      .sort({ createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName")
      .limit(200)
      .lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/lost-found/mine", requireAuth(["student"]), async (req, res) => {
  try {
    const items = await LostFoundItem.find({ studentId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/lost-found/:id/resolve", requireAuth(["admin"]), async (req, res) => {
  try {
    const doc = await LostFoundItem.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    const { notifyUser } = require("../utils/notify");
    await notifyUser(doc.studentId, "Lost & found item marked resolved by admin", "lostfound", {
      itemId: doc._id,
    });
    res.json({ item: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
