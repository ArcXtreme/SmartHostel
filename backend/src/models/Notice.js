const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    audience: { type: String, enum: ["students", "workers"], required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
