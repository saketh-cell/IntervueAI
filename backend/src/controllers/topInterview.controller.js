const TopInterviewQuestion = require("../models/interviewQuestions.model");

const {
  generateTopInterviewQuestions,
} = require("../services/topInterviewQuestions.service");

const getTopInterviewQuestions = async (req, res) => {
  try {

    const { role, experience } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: "Role and experience required",
      });
    }

    const existing = await TopInterviewQuestion.findOne({
      role,
      experience,
    });

    if (existing) {
      return res.json({
        success: true,
        source: "database",
        data: existing,
      });
    }

    const aiData = await generateTopInterviewQuestions({
      role,
      experience,
    });

    const saved = await TopInterviewQuestion.create({
      role: aiData.role,
      experience: aiData.experience,
      questions: aiData.questions,
    });

    res.json({
      success: true,
      source: "gemini",
      data: saved,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });

  }
};

module.exports = {
  getTopInterviewQuestions,
};