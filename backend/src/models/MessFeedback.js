const mongoose = require("mongoose");

const messFeedbackSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    breakfast: { type: Number, min: 1, max: 5, required: true },
    lunch: { type: Number, min: 1, max: 5, required: true },
    dinner: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, default: "" },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessFeedback", messFeedbackSchema);
