const mongoose = require("mongoose");

const coachMessageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId, ref:"CoachSession", required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref:"User", required: true
    },
    sender : {
        type: String, enum:["user", "coach"], required: true
    },
    text:{
        type: String, required: true
    }
},{timestamps: true});

module.exports = mongoose.model("CoachMessage", coachMessageSchema);