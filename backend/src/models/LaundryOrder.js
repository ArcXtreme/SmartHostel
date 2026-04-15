const mongoose = require("mongoose");

const laundryOrderSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, trim: true, default: "" },
    bagLabel: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaundryOrder", laundryOrderSchema);
