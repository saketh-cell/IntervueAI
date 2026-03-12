const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth.route");
const interviewRoutes = require("./routes/interview.route");
const dashboardRoutes = require("./routes/dashboard.route");
const resumeRoutes = require("./routes/resume.route");
const interqChart = require("./routes/interqChat.route");
const passwordRoutes = require("./routes/password.route");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://intervue-ai-gold.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "IntervueAI backend is running" });
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interq", interqChart);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode =
    err.statusCode || (err.message?.includes("Only PDF") ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Primary URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`
  );
});