const fs = require("fs");
const pdfParse = require("pdf-parse");
const resumeService = require("../services/resume.service");
const { analyzeResume } = require("../ai/resumeAnalyzer");
const { computeATSScore } = require("../utils/atsScorer");

const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No resume file uploaded" });
    }

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in request",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Extract text from pdf
    let extractedText = "";
    try {
      const buffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(buffer);

      extractedText = (parsed?.text || "").trim();
    } catch (error) {
      console.error("pdf-parse failed:", error?.message || error);
      extractedText = "";
    }

    // ATS
    const { atsScore, breakdown } = computeATSScore({ extractedText });

    // Gemini analysis
    const analysis =
      extractedText.length > 30
        ? await analyzeResume(extractedText)
        : {
            overallScore: 0,
            strengths: ["Resume uploaded successfully."],
            weaknesses: ["Could not extract text from this PDF."],
            suggestions: [
              "Try uploading a text-based PDF (selectable text).",
              "If this is a scanned PDF, enable OCR on the server.",
            ],
          };

    analysis.atsScore = atsScore;
    analysis.atsBreakdown = breakdown;

    const resume = await resumeService.createResume({
      userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText,
      analysis,
    });

    console.log("UPLOAD req.user._id:", String(req.user._id));
    console.log("UPLOAD req.user.id:", String(req.user.id));
    console.log("SAVED resume.user:", String(resume.user));

    return res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

const getMyResumes = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const resumes = await resumeService.getMyResumes(userId);
    res.json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deleted = await resumeService.deleteResume(userId, req.params.id);
    res.json({ success: true, deletedId: deleted._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getMyResumes,
  deleteResume,
};
