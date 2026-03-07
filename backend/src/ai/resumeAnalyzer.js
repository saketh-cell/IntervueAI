// backend/src/ai/resumeAnalyzer.js
const gemini = require("../config/gemini");
const { buildResumePrompt } = require("./promptTemplate");

const MODEL = "gemini-2.5-flash-lite"; // or "gemini-2.5-flash"

function cleanModelJson(text = "") {
  return String(text)
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

// Convert to string array safely
function toStringArray(val, fallback) {
  if (!Array.isArray(val)) return fallback;
  const arr = val.map((x) => String(x).trim()).filter(Boolean);
  return arr.length ? arr : fallback;
}

// Extract the first balanced JSON object from a string
function extractFirstJson(text) {
  if (!text || typeof text !== "string") return null;

  // Try parsing whole string first
  try {
    return JSON.parse(text);
  } catch {}

  // If model returns an array of objects, try first [...]
  const arrStart = text.indexOf("[");
  if (arrStart !== -1) {
    let depth = 0;
    for (let i = arrStart; i < text.length; i++) {
      if (text[i] === "[") depth++;
      else if (text[i] === "]") {
        depth--;
        if (depth === 0) {
          const candidate = text.slice(arrStart, i + 1);
          try {
            return JSON.parse(candidate);
          } catch {
            break;
          }
        }
      }
    }
  }

  // Then try first { ... }
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
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

const defaultFallback = {
  overallScore: 0,
  strengths: ["Unable to analyze resume at this time."],
  weaknesses: ["Unable to analyze resume at this time."],
  suggestions: ["Please try again later."],
};

const analyzeResume = async (resumeText) => {
  try {
    const prompt = buildResumePrompt(resumeText);

    
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000);

    const response = await gemini.models.generateContent(
      {
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generateConfig:{
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      },
      { signal: controller.signal }
    );

    clearTimeout(t);

    const raw =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "";

   
    if (process.env.NODE_ENV !== "production") {
      console.log("Gemini raw (first 500):", raw.slice(0, 500));
    }

    if (!raw) {
      console.error("analyzeResume: empty model response");
      return defaultFallback;
    }

    const cleaned = cleanModelJson(raw);

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = extractFirstJson(cleaned);
    }


    if (Array.isArray(parsed)) parsed = parsed[0];

    if (!parsed || typeof parsed !== "object") {
      console.error("analyzeResume: failed to parse JSON from model output", {
        cleaned: cleaned.slice(0, 500),
      });
      return defaultFallback;
    }

    
    const safe = {
      overallScore:
        typeof parsed.overallScore === "number"
          ? Math.max(0, Math.min(100, parsed.overallScore))
          : defaultFallback.overallScore,

      strengths: toStringArray(parsed.strengths, defaultFallback.strengths),
      weaknesses: toStringArray(parsed.weaknesses, defaultFallback.weaknesses),
      suggestions: toStringArray(parsed.suggestions, defaultFallback.suggestions),
    };

    return safe;
  } catch (error) {
    const msg = error?.name === "AbortError" ? "Gemini request timed out" : (error?.message || error);
    console.error("analyzeResume: error calling Gemini:", msg);
    return defaultFallback;
  }
};

module.exports = {
  analyzeResume,
};