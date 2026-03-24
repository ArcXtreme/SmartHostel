const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const RoomCleaningRequest = require("../models/RoomCleaningRequest");
const LaundryOrder = require("../models/LaundryOrder");
const MessFeedback = require("../models/MessFeedback");
const LostFoundItem = require("../models/LostFoundItem");
const Notice = require("../models/Notice");
const AppNotification = require("../models/AppNotification");

const router = express.Router();

router.get("/dashboard", requireAuth(), async (req, res) => {
  try {
    const u = req.user;
    const notifications = await AppNotification.find({ userId: u._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    if (u.role === "student") {
      const [
        complaintCount,
        cleaningCount,
        laundryCount,
        lostCount,
        messCount,
      ] = await Promise.all([
        Complaint.countDocuments({ studentId: u._id }),
        RoomCleaningRequest.countDocuments({ studentId: u._id }),
        LaundryOrder.countDocuments({ studentId: u._id }),
        LostFoundItem.countDocuments({ studentId: u._id }),
        MessFeedback.countDocuments({ studentId: u._id }),
      ]);
      const queryCount =
        complaintCount + cleaningCount + laundryCount + lostCount + messCount;
      const notices = await Notice.find({ audience: "students" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("adminId", "name")
        .lean();

      return res.json({
        role: "student",
        queryCount,
        notifications,
        notices,
        cards: {
          complaints: complaintCount,
          cleaning: cleaningCount,
          laundry: laundryCount,
          lostFound: lostCount,
          mess: messCount,
        },
      });
    }

    if (u.role === "admin") {
      const openComplaints = await Complaint.countDocuments({
        status: { $in: ["pending", "in_progress"] },
      });
      const notices = await Notice.find().sort({ createdAt: -1 }).limit(5).populate("adminId", "name").lean();
      return res.json({
        role: "admin",
        queryCount: openComplaints,
        notifications,
        notices,
        cards: { openComplaints },
      });
    }

    if (u.role === "worker") {
      const notices = await Notice.find({ audience: "workers" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("adminId", "name")
        .lean();
      const wid = u._id;
      const assignedComplaints = await Complaint.countDocuments({
        assignedTo: wid,
        status: { $ne: "resolved" },
      });
      const assignedCleaning = await RoomCleaningRequest.countDocuments({
        assignedTo: wid,
        status: { $ne: "completed" },
      });
      const assignedLaundry = await LaundryOrder.countDocuments({
        assignedTo: wid,
        status: { $ne: "completed" },
      });
      return res.json({
        role: "worker",
        queryCount: assignedComplaints + assignedCleaning + assignedLaundry,
        notifications,
        notices,
        cards: {
          complaints: assignedComplaints,
          cleaning: assignedCleaning,
          laundry: assignedLaundry,
        },
      });
    }

    res.status(400).json({ message: "Unknown role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
