const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "admin", "worker"],
      required: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },

    rollNumber: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true, sparse: true },
    hostelName: { type: String, trim: true },
    roomNumber: { type: String, trim: true },

    idNumber: { type: String, trim: true, sparse: true },

    workerId: { type: String, trim: true, sparse: true },

    lastRoomCleanedAt: Date,
    lastRoomCleanedByName: { type: String, trim: true },

    availabilityNote: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ idNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ workerId: 1 }, { unique: true, sparse: true });
userSchema.index(
  { hostelName: 1, roomNumber: 1 },
  { unique: true, partialFilterExpression: { role: "student", hostelName: { $type: "string" } } }
);

module.exports = mongoose.model("User", userSchema);
