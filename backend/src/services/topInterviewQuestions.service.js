const { GoogleGenAI } = require("@google/genai");

const {
  buildTopInterviewQuestionsPrompt,
} = require("../ai/interviewPrompt.js");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTopInterviewQuestions = async ({ role, experience }) => {

  const prompt = buildTopInterviewQuestionsPrompt({
    role,
    experience,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  let text = response.text;

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
};

module.exports = {
  generateTopInterviewQuestions,
};