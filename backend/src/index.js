require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { uploadRoot } = require("./middleware/upload");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const notificationsRoutes = require("./routes/notifications");
const complaintsRoutes = require("./routes/complaints");
const cleaningRoutes = require("./routes/cleaning");
const laundryRoutes = require("./routes/laundry");
const messRoutes = require("./routes/mess");
const lostfoundRoutes = require("./routes/lostfound");
const noticesRoutes = require("./routes/notices");
const adminRoutes = require("./routes/admin");
const workerRoutes = require("./routes/worker");
const studentRoutes = require("./routes/student");
const profileRoutes = require("./routes/profile");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = CLIENT_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI env variable");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set — using insecure default for development only");
}

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors()); // IMPORTANT for preflight
app.use(express.json({ limit: "2mb" }));

app.use("/uploads", express.static(uploadRoot));

app.get("/", (req, res) => {
  res.json({ status: "ok", name: "Hostel Management System API" });
});

app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", notificationsRoutes);
app.use("/api", complaintsRoutes);
app.use("/api", cleaningRoutes);
app.use("/api", laundryRoutes);
app.use("/api", messRoutes);
app.use("/api", lostfoundRoutes);
app.use("/api", noticesRoutes);
app.use("/api", adminRoutes);
app.use("/api", workerRoutes);
app.use("/api", studentRoutes);
app.use("/api", profileRoutes);

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
