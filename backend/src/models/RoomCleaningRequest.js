const mongoose = require("mongoose");

const roomCleaningRequestSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelName: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    studentNote: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    workerCompletedAt: Date,
    workerName: { type: String, trim: true },
    studentConfirmedAt: Date,
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomCleaningRequest", roomCleaningRequestSchema);
