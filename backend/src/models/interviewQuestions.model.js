const mongoose = require("mongoose");

const topInterviewQuestionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        category: {
          type: String,
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
        },
      },
    ],

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

topInterviewQuestionSchema.index({ role: 1, experience: 1 });

module.exports = mongoose.model(
  "TopInterviewQuestion",
  topInterviewQuestionSchema
);