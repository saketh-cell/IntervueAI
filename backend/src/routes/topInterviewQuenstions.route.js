const express = require("express");

const router = express.Router();

const {
  getTopInterviewQuestions,
} = require("../controllers/topInterview.controller");

router.post("/generate", getTopInterviewQuestions);

module.exports = router;