const Resume = require("../models/resume.model");
const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const { resumeAnalysisEmail } = require("../utils/emailTemplates");

const createResume = async ({
  userId,
  originalName,
  storedName,
  fileUrl,
  mimeType,
  size,
  extractedText,
  analysis,
}) => {
  const resume = await Resume.create({
    user: userId,
    originalName,
    storedName,
    fileUrl,
    mimeType,
    size,
    extractedText: extractedText || "",
    analysis: analysis || undefined,
  });

  // Send ATS/result email if analysis exists
  if (analysis) {
    try {
      const user = await User.findById(userId).select("name email");

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Your IntervueAI Resume Analysis",
          html: resumeAnalysisEmail(user.name, {
            atsScore: analysis.atsScore || 0,
            topSuggestion:
              analysis.topSuggestion ||
              "Improve keywords, project impact, and formatting for better ATS performance.",
          }),
        });
      }
    } catch (emailError) {
      console.error("Resume analysis email failed:", emailError.message);
    }
  }

  return resume;
};

const getMyResumes = async (userId) => {
  return Resume.find({ user: userId }).sort({ createdAt: -1 });
};

const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });

  if (!resume) {
    const err = new Error("Resume Not Found");
    err.statusCode = 404;
    throw err;
  }

  await resume.deleteOne();
  return resume;
};

module.exports = {
  createResume,
  getMyResumes,
  deleteResume,
};