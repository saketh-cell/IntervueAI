const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

  
    originalName: {
      type: String,
      required: true,
    },

    
    storedName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    mimeType: String,
    size: Number,

    extractedText: {
      type: String,
      default: "",
    },

    analysis: {
      overallScore: { type: Number, default: 0 },
      atsScore: {type: Number, default: 0},
      atsBreakdown: {type: Object, default: {}},
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);