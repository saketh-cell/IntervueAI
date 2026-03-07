const InterviewSession = require("../models/interviewSession.model");
const { generateInterviewQuestions } = require("../ai/questionGenerator");
const { evaluateAnswer } = require("../ai/answerEvaluator");

// Create a new interview session
const createInterviewSession = async (userId, role, level) => {
  const questions = await generateInterviewQuestions(role, level);

  return await InterviewSession.create({
    user: userId,
    role,
    experienceLevel: level,
    questions: questions.map((q) => ({
      question: q,
      userAnswer: "",
      aiFeedback: "",
      score: 0,
    })),
  });
};

// Submit answer for one question
const submitAnswerSession = async (interviewId, questionIndex, userAnswer) => {
  const interview = await InterviewSession.findById(interviewId);

  if (!interview) {
    throw new Error("Interview session not found");
  }

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    throw new Error("Invalid question index");
  }

  const questionText = interview.questions[questionIndex].question;
  const evaluation = await evaluateAnswer(questionText, userAnswer);

  interview.questions[questionIndex].userAnswer = userAnswer;
  interview.questions[questionIndex].aiFeedback = evaluation?.feedback || "";
  interview.questions[questionIndex].score = Number(evaluation?.score || 0);

  await interview.save();
  return interview;
};

// Complete interview session
const completeInterviewSession = async (interviewId) => {
  const interview = await InterviewSession.findById(interviewId);

  if (!interview) {
    throw new Error("Interview session not found");
  }

  const totalScore = interview.questions.reduce(
    (acc, q) => acc + (q.score || 0),
    0
  );

  const averageScore = interview.questions.length
    ? totalScore / interview.questions.length
    : 0;

  interview.score = Number(averageScore.toFixed(1));
  interview.status = "completed";

  await interview.save();

  return {
    averageScore: interview.score,
    interview,
  };
};

// Get one interview result by id for logged-in user
const getInterviewSessionById = async (interviewId, userId) => {
  const interview = await InterviewSession.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new Error("Interview session not found");
  }

  return interview;
};

module.exports = {
  createInterviewSession,
  submitAnswerSession,
  completeInterviewSession,
  getInterviewSessionById,
};