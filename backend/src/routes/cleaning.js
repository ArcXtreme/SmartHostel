const express = require("express");
const { requireAuth } = require("../middleware/auth");
const RoomCleaningRequest = require("../models/RoomCleaningRequest");
const User = require("../models/User");
const { notifyUser } = require("../utils/notify");

const router = express.Router();

const CLEANING_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
];

function todayStr() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

router.get("/cleaning/slots", (req, res) => {
  res.json({ slots: CLEANING_SLOTS });
});

router.post("/cleaning/request", requireAuth(["student"]), async (req, res) => {
  try {
    const { date, timeSlot, studentNote } = req.body;
    const day = date || todayStr();
    if (!timeSlot || !CLEANING_SLOTS.includes(timeSlot)) {
      return res.status(400).json({ message: "Valid time slot (9 AM - 3 PM) is required" });
    }
    const dup = await RoomCleaningRequest.findOne({
      studentId: req.user._id,
      date: day,
      timeSlot,
      status: { $ne: "completed" },
    });
    if (dup) {
      return res.status(409).json({ message: "You already have a request for this slot" });
    }

    const reqDoc = await RoomCleaningRequest.create({
      studentId: req.user._id,
      hostelName: req.user.hostelName,
      roomNumber: req.user.roomNumber,
      date: day,
      timeSlot,
      studentNote: String(studentNote || "").trim(),
    });

    const admins = await User.find({ role: "admin" }).select("_id");
    for (const a of admins) {
      await notifyUser(
        a._id,
        `New room cleaning request: ${req.user.hostelName} ${req.user.roomNumber} (${day} ${timeSlot})`,
        "cleaning_request",
        { cleaningId: reqDoc._id }
      );
    }

    res.status(201).json({ request: reqDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/cleaning/my", requireAuth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select(
      "lastRoomCleanedAt lastRoomCleanedByName roomNumber hostelName"
    );
    const requests = await RoomCleaningRequest.find({ studentId: req.user._id })
      .sort({ date: -1, timeSlot: -1 })
      .populate("assignedTo", "name workerId")
      .lean();
    res.json({
      lastCleanedAt: student.lastRoomCleanedAt,
      lastCleanedBy: student.lastRoomCleanedByName,
      requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/cleaning/today", requireAuth(), async (req, res) => {
  try {
    const day = todayStr();
    const rows = await RoomCleaningRequest.find({ date: day })
      .sort({ timeSlot: 1, roomNumber: 1 })
      .populate("studentId", "name roomNumber hostelName availabilityNote")
      .populate("assignedTo", "name workerId")
      .lean();
    res.json({ date: day, requests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/cleaning/worker", requireAuth(["worker"]), async (req, res) => {
  try {
    const rows = await RoomCleaningRequest.find({
      assignedTo: req.user._id,
      status: { $ne: "completed" },
    })
      .sort({ date: 1, timeSlot: 1 })
      .populate("studentId", "name roomNumber hostelName availabilityNote")
      .lean();

    const open = await RoomCleaningRequest.find({
      status: "pending",
      assignedTo: null,
    })
      .sort({ date: 1, timeSlot: 1 })
      .populate("studentId", "name roomNumber hostelName availabilityNote")
      .lean();

    res.json({ assigned: rows, openPool: open });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/cleaning/:id/complete-worker", requireAuth(["worker"]), async (req, res) => {
  try {
    const doc = await RoomCleaningRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (!doc.assignedTo || String(doc.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not assigned to you" });
    }
    doc.status = "completed";
    doc.workerCompletedAt = new Date();
    doc.workerName = req.user.name;
    await doc.save();

    const student = await User.findById(doc.studentId);
    if (student) {
      student.lastRoomCleanedAt = doc.workerCompletedAt;
      student.lastRoomCleanedByName = req.user.name;
      await student.save();
    }

    await notifyUser(
      doc.studentId,
      `Room cleaning marked completed for ${doc.roomNumber}. Please confirm and rate.`,
      "cleaning_done",
      { cleaningId: doc._id }
    );

    const populated = await RoomCleaningRequest.findById(doc._id)
      .populate("studentId", "name")
      .lean();
    res.json({ request: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/cleaning/:id/confirm-student", requireAuth(["student"]), async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: "Rating 1-5 required" });
    }
    const doc = await RoomCleaningRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (String(doc.studentId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your request" });
    }
    if (doc.status !== "completed") {
      return res.status(400).json({ message: "Cleaning must be completed by worker first" });
    }
    doc.studentConfirmedAt = new Date();
    doc.rating = r;
    doc.feedback = String(feedback || "").trim();
    await doc.save();
    res.json({ request: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/cleaning/:id/start", requireAuth(["worker"]), async (req, res) => {
  try {
    const doc = await RoomCleaningRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.assignedTo && String(doc.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: "Assigned to another worker" });
    }
    doc.assignedTo = req.user._id;
    doc.status = "in_progress";
    await doc.save();

    await notifyUser(
      doc.studentId,
      `Cleaning in progress for your room (${doc.timeSlot})`,
      "cleaning_progress",
      { cleaningId: doc._id }
    );

    res.json({ request: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
