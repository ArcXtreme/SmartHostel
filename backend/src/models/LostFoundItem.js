const mongoose = require("mongoose");

const lostFoundItemSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    collectAt: { type: String, trim: true, default: "" },
    images: [{ type: String }],
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostFoundItem", lostFoundItemSchema);
