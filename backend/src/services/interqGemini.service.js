const gemini = require('../config/gemini');
const coachMessage = require('../models/coachMessage.model');
const {buildInterQPrompt} = require('../ai/interqPrompt');

async function buildContext({sessionId, userId, limit= 30}) {
    const historyDocs = await coachMessage.find({sessionId, userId})
      .sort({createdAt:1})
      .limit(limit);

    return historyDocs
        .map((m)=> `${m.sender === "user" ? "User" : "Assistant"} : ${m.text}`)
        .join("\n");
}

async function startGeminiStream({sessionId, userId, userMessage}) {
    const context = await buildContext({ sessionId, userId});

    const prompt = buildInterQPrompt({
        context,
        userMessage: userMessage.trim(),
    });

    const stream = await gemini.models.generateContentStream({
        model:"gemini-2.0-flash",
        contents: prompt,
    });

    return { stream, prompt};
}

module.exports = {
    startGeminiStream,
    buildContext,
}