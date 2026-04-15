const express = require("express");
const { requireAuth } = require("../middleware/auth");
const LaundryOrder = require("../models/LaundryOrder");
const User = require("../models/User");
const { notifyUser } = require("../utils/notify");

const router = express.Router();

router.post("/laundry", requireAuth(["student"]), async (req, res) => {
  try {
    const { description, bagLabel } = req.body;
    const order = await LaundryOrder.create({
      studentId: req.user._id,
      description: String(description || "").trim(),
      bagLabel: String(bagLabel || "").trim(),
    });
    const admins = await User.find({ role: "admin" }).select("_id");
    for (const a of admins) {
      await notifyUser(a._id, "New laundry order submitted", "laundry", { laundryId: order._id });
    }
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/laundry/my", requireAuth(["student"]), async (req, res) => {
  try {
    const orders = await LaundryOrder.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name workerId")
      .populate("studentId", "roomNumber hostelName name")
      .lean();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/laundry/feedback", requireAuth(["student"]), async (req, res) => {
  try {
    const { laundryId, rating, description } = req.body || {};
    const r = Number(rating);
    if (!laundryId) return res.status(400).json({ message: "laundryId required" });
    if (!Number.isFinite(r) || r < 1 || r > 5) return res.status(400).json({ message: "Rating 1-5 required" });
    const doc = await LaundryOrder.findById(laundryId);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (String(doc.studentId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    doc.rating = r;
    doc.feedback = String(description || "").trim();
    await doc.save();
    res.status(201).json({ feedback: { rating: doc.rating, description: doc.feedback } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/laundry/all", requireAuth(["admin"]), async (req, res) => {
  try {
    const orders = await LaundryOrder.find()
      .sort({ createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName email")
      .populate("assignedTo", "name workerId")
      .lean();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/laundry/worker", requireAuth(["worker"]), async (req, res) => {
  try {
    const mine = await LaundryOrder.find({ assignedTo: req.user._id })
      .sort({ status: 1, createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName")
      .lean();
    const open = await LaundryOrder.find({ assignedTo: null, status: "pending" })
      .sort({ createdAt: -1 })
      .populate("studentId", "name roomNumber hostelName")
      .lean();
    res.json({ assigned: mine, openPool: open });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/laundry/:id/claim", requireAuth(["worker"]), async (req, res) => {
  try {
    const doc = await LaundryOrder.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.assignedTo) {
      return res.status(409).json({ message: "Already assigned" });
    }
    doc.assignedTo = req.user._id;
    doc.status = "in_progress";
    await doc.save();
    await notifyUser(doc.studentId, "A worker picked up your laundry order", "laundry_status", {
      laundryId: doc._id,
    });
    res.json({ order: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/laundry/:id/status", requireAuth(["worker", "admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const doc = await LaundryOrder.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (req.user.role === "worker") {
      if (!doc.assignedTo || String(doc.assignedTo) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
    }
    doc.status = status;
    await doc.save();

    await notifyUser(
      doc.studentId,
      `Laundry status updated: ${status.replace("_", " ")}`,
      "laundry_status",
      { laundryId: doc._id }
    );

    res.json({ order: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/laundry/:id/assign", requireAuth(["admin"]), async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ message: "workerId required" });
    const worker = await User.findOne({ role: "worker", _id: workerId });
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    const doc = await LaundryOrder.findByIdAndUpdate(
      req.params.id,
      { assignedTo: worker._id, status: "in_progress" },
      { new: true }
    ).populate("studentId", "name email");
    if (!doc) return res.status(404).json({ message: "Not found" });

    await notifyUser(worker._id, "Laundry task assigned to you", "task_assigned", {
      laundryId: doc._id,
    });
    if (doc.studentId && doc.studentId._id) {
      await notifyUser(doc.studentId._id, "Your laundry order is being processed", "laundry_status", {
        laundryId: doc._id,
      });
    }

    res.json({ order: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
