const express = require("express");
const { requireAuth } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const RoomCleaningRequest = require("../models/RoomCleaningRequest");

const router = express.Router();

router.get("/admin/analytics", requireAuth(["admin"]), async (req, res) => {
  try {
    const categories = ["internet", "furniture", "electricity", "water", "cleanliness_common"];
    const counts = {};
    for (const c of categories) {
      counts[c] = await Complaint.countDocuments({ category: c });
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    let topCategory = null;
    let topN = -1;
    for (const [k, v] of Object.entries(counts)) {
      if (v > topN) {
        topN = v;
        topCategory = k;
      }
    }
    const openByStatus = {
      pending: await Complaint.countDocuments({ status: "pending" }),
      in_progress: await Complaint.countDocuments({ status: "in_progress" }),
      resolved: await Complaint.countDocuments({ status: "resolved" }),
    };
    res.json({
      complaintCountsByCategory: counts,
      totalComplaints: total,
      highestCategory: topCategory,
      openByStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/workers", requireAuth(["admin"]), async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" })
      .select("name workerId createdAt")
      .sort({ name: 1 })
      .lean();
    res.json({ workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/admin/cleaning/:id/assign", requireAuth(["admin"]), async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ message: "workerId required" });
    const worker = await User.findOne({ role: "worker", _id: workerId });
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    const doc = await RoomCleaningRequest.findByIdAndUpdate(
      req.params.id,
      { assignedTo: worker._id, status: "in_progress" },
      { new: true }
    ).populate("studentId", "name email roomNumber");
    if (!doc) return res.status(404).json({ message: "Not found" });

    const { notifyUser } = require("../utils/notify");
    await notifyUser(worker._id, "Room cleaning assigned to you", "task_assigned", {
      cleaningId: doc._id,
    });
    if (doc.studentId && doc.studentId._id) {
      await notifyUser(doc.studentId._id, "A worker has been assigned for your cleaning", "cleaning", {
        cleaningId: doc._id,
      });
    }

    res.json({ request: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
