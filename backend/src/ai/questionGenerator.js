const gemini = require("../config/gemini");
const { buildQuestionPrompt } = require("./promptTemplate");

const MODEL = "gemini-2.5-flash-lite";

function cleanModelJson(text = "") {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

function extractFirstJson(text) {
  if (!text || typeof text !== "string") return null;
  try { return JSON.parse(text); } catch {}

  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        try { return JSON.parse(candidate); } catch { return null; }
      }
    }
  }
  return null;
}

const generateInterviewQuestions = async (role, level) => {
  try {
    const prompt = buildQuestionPrompt(role, level);

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
    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      console.error("Invalid JSON shape from model:", cleaned);
      return [
        "Introduce yourself.",
        "Explain your recent project.",
        "Explain REST API and status codes.",
        "Explain JavaScript event loop.",
        "Explain React hooks you use most.",
      ];
    }

    return parsed.questions;
  } catch (error) {
    console.error("Error generating interview questions:", error?.message || error);
    return [
      "Introduce yourself.",
      "What are your strengths and weaknesses?",
      "Explain your recent project.",
      "Explain REST API and status codes.",
      "Explain JavaScript closures with example.",
    ];
  }
};

module.exports = { generateInterviewQuestions };