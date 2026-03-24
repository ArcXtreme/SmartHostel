const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const RoomCleaningRequest = require("../models/RoomCleaningRequest");
const LaundryOrder = require("../models/LaundryOrder");

const router = express.Router();

router.get("/worker/tasks", requireAuth(["worker"]), async (req, res) => {
  try {
    const [complaints, cleaningAssigned, cleaningOpen, laundryAssigned, laundryOpen] =
      await Promise.all([
        Complaint.find({ assignedTo: req.user._id, status: { $ne: "resolved" } })
          .sort({ status: 1, createdAt: 1 })
          .populate("studentId", "name roomNumber hostelName availabilityNote")
          .lean(),
        RoomCleaningRequest.find({
          assignedTo: req.user._id,
          status: { $ne: "completed" },
        })
          .sort({ date: 1, timeSlot: 1 })
          .populate("studentId", "name roomNumber hostelName availabilityNote")
          .lean(),
        RoomCleaningRequest.find({ status: "pending", assignedTo: null })
          .sort({ date: 1, timeSlot: 1 })
          .populate("studentId", "name roomNumber hostelName availabilityNote")
          .lean(),
        LaundryOrder.find({ assignedTo: req.user._id, status: { $ne: "completed" } })
          .sort({ status: 1, createdAt: 1 })
          .populate("studentId", "name roomNumber hostelName")
          .lean(),
        LaundryOrder.find({ assignedTo: null, status: "pending" })
          .sort({ createdAt: -1 })
          .populate("studentId", "name roomNumber hostelName")
          .lean(),
      ]);

    res.json({
      complaints,
      cleaning: { assigned: cleaningAssigned, openPool: cleaningOpen },
      laundry: { assigned: laundryAssigned, openPool: laundryOpen },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
