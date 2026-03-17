require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.route");
const interviewRoutes = require("./routes/interview.route");
const dashboardRoutes = require("./routes/dashboard.route");
const resumeRoutes = require("./routes/resume.route");
const interqChart = require("./routes/interqChat.route");
const passwordRoutes = require("./routes/password.route");
const topInterviewQuestions = require("./routes/topInterviewQuenstions.route")

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Method:", req.method, "URL:", req.originalUrl, "Origin:", req.headers.origin);
  next();
});

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
app.use("/api/top-interview-questions", topInterviewQuestions);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Primary URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();