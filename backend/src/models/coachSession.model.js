const mongoose = require("mongoose");

const coachSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "InterQ Coach Chat" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoachSession", coachSessionSchema);