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

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interq", interqChart);


app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode =
    err.statusCode ||
    (err.message?.includes("Only PDF") ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});