require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const cropRoutes = require("./routes/cropRoutes");
const fpoRoutes = require("./routes/fpoRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "null"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "✅ AgriSmart API is running",
    version: "1.0.0",
    endpoints: [
      "GET  /api/crops",
      "GET  /api/crops/:name",
      "POST /api/analyze",
      "GET  /api/analyze/compare",
      "GET  /api/fpos",
      "GET  /api/testimonials"
    ]
  });
});

app.use("/api/crops", cropRoutes);
app.use("/api/fpos", fpoRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/analyze", analyzeRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`\n🌿 AgriSmart API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGO_URI}\n`);
});