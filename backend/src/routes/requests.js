const express = require("express");
const CleaningRequest = require("../models/CleaningRequest");

const router = express.Router();

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// POST /request-cleaning
router.post("/request-cleaning", async (req, res) => {
  try {
    const { roomNumber, timeSlot, date } = req.body;
    if (!roomNumber || !timeSlot) {
      return res.status(400).json({ message: "Room number and time slot are required" });
    }

    const day = date || getTodayString();

    const existing = await CleaningRequest.findOne({ roomNumber, timeSlot, date: day });
    if (existing) {
      return res.status(409).json({ message: "This slot is already booked for your room" });
    }

    const request = await CleaningRequest.create({
      roomNumber,
      timeSlot,
      date: day,
    });

    res.status(201).json({ message: "Request created", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /today-requests
router.get("/today-requests", async (req, res) => {
  try {
    const day = getTodayString();
    const requests = await CleaningRequest.find({ date: day }).sort({ timeSlot: 1, roomNumber: 1 });
    res.json({ date: day, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /history
router.get("/history", async (req, res) => {
  try {
    const { roomNumber } = req.query;
    const filter = roomNumber ? { roomNumber } : {};
    const history = await CleaningRequest.find(filter).sort({ date: -1, timeSlot: 1 });
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /mark-complete
router.patch("/mark-complete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Request id is required" });
    }

    const updated = await CleaningRequest.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request marked as completed", request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

