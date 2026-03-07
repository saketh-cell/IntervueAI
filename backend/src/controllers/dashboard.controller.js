const InterviewSession = require("../models/interviewSession.model");
const Resume = require("../models/resume.model");

// GET /api/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const completed = await InterviewSession.find({
      user: userId,
      status: "completed",
    }).sort({ updatedAt: -1 });

    const totalInterviews = completed.length;

    const totalResumes = await Resume.countDocuments({ user: userId });


    const avgScore =
      totalInterviews === 0
        ? 0
        : completed.reduce((acc, it) => acc + Number(it.score || 0), 0) /
          totalInterviews;

    const lastInterviewDate = totalInterviews ? completed[0].updatedAt : null;
    const recent = completed.slice(0, 5);

    res.json({
      name: req.user.name || "User",
      stats: {
        totalResumes,
        totalInterviews,
        avgScore,
        lastInterviewDate,
      },
      recent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
