const gemini = require("../config/gemini");
const { buildAnswerEvaluationPrompt } = require("./promptTemplate");

const MODEL = "gemini-2.5-flash-lite"; 

function cleanModelJson(text = "") {
  return String(text)
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

function extractFirstJson(text) {
  if (!text || typeof text !== "string") return null;


  try {
    return JSON.parse(text);
  } catch {}

  
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

const evaluateAnswer = async (question, answer) => {
  try {
    const prompt = buildAnswerEvaluationPrompt(question, answer);

    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "";

    const cleaned = cleanModelJson(raw);
    const parsed = extractFirstJson(cleaned);

    if (!parsed) {
      console.error("evaluateAnswer: JSON parse failed. Raw:", raw);
      return { feedback: "Could not parse evaluation. Please try again.", score: 50 };
    }

    // sanitize output
    const feedback =
      typeof parsed.feedback === "string" ? parsed.feedback : "Feedback unavailable.";

    let score = typeof parsed.score === "number" ? parsed.score : 50;
    if (Number.isNaN(score)) score = 50;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return { feedback, score };
  } catch (error) {
    console.error("Error evaluating answer:", error?.message || error);
    return { feedback: "Error evaluating answer. Please try again.", score: 50 };
  }
};

module.exports = {
  evaluateAnswer,
};