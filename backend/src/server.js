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

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://intervue-ai-hazel.vercel.app",
  "https://intervue-ai-gold.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IntervueAI backend is running",
  });
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

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

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Primary URL: ${
          process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();