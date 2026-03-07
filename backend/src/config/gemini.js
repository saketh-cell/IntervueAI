
const { GoogleGenAI } = require("@google/genai");


const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

module.exports = gemini;