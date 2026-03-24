const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const { notifyUser } = require("../utils/notify");
const { makeUploader } = require("../middleware/upload");

const router = express.Router();
const uploadComplaint = makeUploader("complaints", { maxCount: 4, maxSizeMb: 8 });

const CATEGORIES = ["internet", "furniture", "electricity", "water", "cleanliness_common"];

router.post("/complaints", requireAuth(["student"]), async (req, res) => {
  try {
    const { category, title, description, details, images } = req.body;
    if (!category || !title) {
      return res.status(400).json({ message: "Category and title are required" });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    const doc = await Complaint.create({
      category,
      studentId: req.user._id,
      title: String(title).trim(),
      description: String(description || "").trim(),
      details: details && typeof details === "object" ? details : {},
      images: Array.isArray(images) ? images : [],
    });
    res.status(201).json({ complaint: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/complaints/my", requireAuth(["student"]), async (req, res) => {
  try {
    const rows = await Complaint.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name workerId")
      .lean();
    res.json({ complaints: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/complaints", requireAuth(["admin"]), async (req, res) => {
  try {
    const { category, status } = req.query;
    const q = {};
    if (category) q.category = category;
    if (status) q.status = status;
    const rows = await Complaint.find(q)
      .sort({ createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName email rollNumber")
      .populate("assignedTo", "name workerId")
      .lean();
    res.json({ complaints: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/complaints/worker/mine", requireAuth(["worker"]), async (req, res) => {
  try {
    const rows = await Complaint.find({ assignedTo: req.user._id })
      .sort({ status: 1, createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName availabilityNote")
      .lean();
    res.json({ complaints: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/complaints/:id/assign", requireAuth(["admin"]), async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ message: "workerId is required" });
    const User = require("../models/User");
    const worker = await User.findOne({ role: "worker", _id: workerId });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: worker._id, status: "in_progress" },
      { new: true }
    ).populate("studentId", "name email");

    if (!doc) return res.status(404).json({ message: "Complaint not found" });

    await notifyUser(
      worker._id,
      `New task assigned: ${doc.title}`,
      "task_assigned",
      { complaintId: doc._id }
    );
    if (doc.studentId && doc.studentId._id) {
      await notifyUser(
        doc.studentId._id,
        `Your complaint "${doc.title}" is now in progress`,
        "complaint_status",
        { complaintId: doc._id }
      );
    }

    res.json({ complaint: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/complaints/:id/status", requireAuth(["admin", "worker"]), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "worker") {
      if (!doc.assignedTo || String(doc.assignedTo) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
      if (status === "pending") {
        return res.status(400).json({ message: "Workers cannot revert to pending" });
      }
    }

    const prev = doc.status;
    doc.status = status;
    if (status === "resolved") doc.resolvedAt = new Date();
    await doc.save();

    await notifyUser(
      doc.studentId,
      `Complaint "${doc.title}" status: ${status.replace("_", " ")}`,
      "complaint_status",
      { complaintId: doc._id }
    );

    if (req.user.role === "worker" && status !== prev) {
      const User = require("../models/User");
      const admins = await User.find({ role: "admin" }).select("_id");
      for (const a of admins) {
        await notifyUser(
          a._id,
          `Worker updated complaint "${doc.title}" to ${status}`,
          "admin_update",
          { complaintId: doc._id }
        );
      }
    }

    const populated = await Complaint.findById(doc._id)
      .populate("studentId", "name roomNumber hostelName")
      .populate("assignedTo", "name workerId")
      .lean();

    res.json({ complaint: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/complaints/upload-images", requireAuth(["student"]), (req, res) => {
  uploadComplaint.array("images", 4)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    try {
      const urls = (req.files || []).map((f) => `/uploads/complaints/${path.basename(f.path)}`);
      res.json({ urls });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  });
});

router.patch("/complaints/:id/cleanliness-meta", requireAuth(["admin", "worker"]), async (req, res) => {
  try {
    const { lastCleanedAt, lastCleanedByName, areasUnderCleaning } = req.body;
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.category !== "cleanliness_common") {
      return res.status(400).json({ message: "Only cleanliness complaints support this" });
    }
    if (req.user.role === "worker") {
      if (!doc.assignedTo || String(doc.assignedTo) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
    }
    if (lastCleanedAt !== undefined) doc.lastCleanedAt = lastCleanedAt ? new Date(lastCleanedAt) : null;
    if (lastCleanedByName !== undefined) doc.lastCleanedByName = String(lastCleanedByName || "").trim();
    if (areasUnderCleaning !== undefined) doc.areasUnderCleaning = String(areasUnderCleaning || "").trim();
    await doc.save();
    res.json({ complaint: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
