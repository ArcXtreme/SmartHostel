require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = CLIENT_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI env variable");
  process.exit(1);
}

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser tools (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Smart Hostel API" });
});

app.use("/", authRoutes);
app.use("/", requestRoutes);

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

