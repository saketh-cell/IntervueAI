const Resume = require("../models/resume.model");

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
  return Resume.create({
    user: userId, 
    originalName,
    storedName,
    fileUrl,
    mimeType,
    size,
    extractedText: extractedText || "",
    analysis: analysis || undefined,
  });
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