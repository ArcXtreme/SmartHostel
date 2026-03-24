const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["internet", "furniture", "electricity", "water", "cleanliness_common"],
      required: true,
    },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: Date,
    lastCleanedAt: Date,
    lastCleanedByName: { type: String, trim: true },
    areasUnderCleaning: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
