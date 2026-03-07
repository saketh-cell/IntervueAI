const express = require("express");
const router = express.Router();

const {
  createInterview,
  submitAnswer,
  completeInterview,
  getMySessions,
  getInterviewById,
} = require("../controllers/interview.controller");

const { protect } = require("../middleware/auth.middleware");

// Start interview
router.post("/start", protect, createInterview);

// Get all sessions
router.get("/my-sessions", protect, getMySessions);

// Get one interview result
router.get("/:interviewId", protect, getInterviewById);

// Submit answer
router.post("/:interviewId/answer/:questionIndex", protect, submitAnswer);

// Complete interview
router.post("/:interviewId/complete", protect, completeInterview);

module.exports = router;