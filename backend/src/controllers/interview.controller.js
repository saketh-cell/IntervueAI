const interviewService = require("../services/interview.service");
const InterviewSession = require("../models/interviewSession.model");

// POST /api/interview/start
const createInterview = async (req, res, next) => {
  try {
    const { role, experienceLevel } = req.body;

    const interview = await interviewService.createInterviewSession(
      req.user.id,
      role,
      experienceLevel
    );

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/interview/:interviewId/answer/:questionIndex
const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex } = req.params;
    const { answer } = req.body;

    const updatedInterview = await interviewService.submitAnswerSession(
      interviewId,
      Number(questionIndex),
      answer
    );

    res.status(200).json({
      success: true,
      interview: updatedInterview,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/interview/:interviewId/complete
const completeInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const result = await interviewService.completeInterviewSession(interviewId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/interview/my-sessions?status=completed
const getMySessions = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = { user: req.user.id };

    if (status) filter.status = status;

    const sessions = await InterviewSession.find(filter).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/interview/:interviewId
const getInterviewById = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const interview = await interviewService.getInterviewSessionById(
      interviewId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  submitAnswer,
  completeInterview,
  getMySessions,
  getInterviewById,
};