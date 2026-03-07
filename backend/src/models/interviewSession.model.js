const mongoose = require('mongoose');

// InterViewSession schema

const interviewSessionSchema = new mongoose.Schema(
    {
       user: {
         type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
       },
       role: {
        type: String,
        required: true,
       },
       experienceLevel: {
        type: String,  // Beginner / Intermidate / Advanced
       },

       questions: [
        {
            question: String,
            userAnswer: String,
            aiFeedback: String,
            score: Number,
        },
       ],
       score: {
        type: Number,
        default: 0,
       },
       status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress',
       },
    },
    { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);