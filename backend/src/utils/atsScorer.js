// backend/src/utils/atsScorer.js

const SECTION_PATTERNS = [
  { key: "summary", weight: 8, patterns: [/summary/i, /objective/i, /profile/i] },
  { key: "skills", weight: 12, patterns: [/skills/i, /technical skills/i, /tools/i] },
  { key: "experience", weight: 18, patterns: [/experience/i, /work experience/i, /employment/i, /internship/i] },
  { key: "projects", weight: 12, patterns: [/projects/i, /project experience/i] },
  { key: "education", weight: 10, patterns: [/education/i, /academics/i] },
];

const hasAnyPattern = (text, patterns) => patterns.some((re) => re.test(text));

const countMatches = (text, keywords) => {
  if (!keywords?.length) return { matched: 0, total: 0 };
  const lower = text.toLowerCase();
  const uniq = [...new Set(keywords.map((k) => k.toLowerCase().trim()).filter(Boolean))];
  let matched = 0;
  for (const k of uniq) {
    // word-ish boundary match
    const re = new RegExp(`(^|\\W)${escapeRegex(k)}(\\W|$)`, "i");
    if (re.test(lower)) matched++;
  }
  return { matched, total: uniq.length };
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function computeATSScore({ extractedText, jobKeywords = [] }) {
  const text = String(extractedText || "");
  const lower = text.toLowerCase();

  const breakdown = {
    parseability: 0,
    sections: 0,
    keywords: 0,
    formatting: 0,
    completeness: 0,
  };

  
  breakdown.parseability = text.length > 500 ? 20 : text.length > 100 ? 12 : text.length > 0 ? 6 : 0;

 
  const sectionsMax = SECTION_PATTERNS.reduce((a, s) => a + s.weight, 0);
  let sectionsScoreRaw = 0;
  const sectionsFound = {};
  for (const s of SECTION_PATTERNS) {
    const ok = hasAnyPattern(text, s.patterns);
    sectionsFound[s.key] = ok;
    if (ok) sectionsScoreRaw += s.weight;
  }
  breakdown.sections = Math.round((sectionsScoreRaw / sectionsMax) * 30);

  
  if (!jobKeywords.length) {
    breakdown.keywords = 10;
  } else {
    const { matched, total } = countMatches(text, jobKeywords);
    breakdown.keywords = total === 0 ? 0 : Math.round((matched / total) * 25);
  }

 
  const weirdChars = (text.match(/[•·▪●■◆▶]/g) || []).length;
  const manyPipes = (text.match(/\|/g) || []).length;
  const manyTabs = (text.match(/\t/g) || []).length;
  const tooManyLines = (text.split("\n").length > 200);

  let formatScore = 15;
  if (weirdChars > 200) formatScore -= 5;
  if (manyPipes > 80) formatScore -= 4;
  if (manyTabs > 20) formatScore -= 3;
  if (tooManyLines) formatScore -= 3;
  breakdown.formatting = Math.max(0, formatScore);


  const hasEmail = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/.test(lower);
  const hasPhone = /\b(\+?\d[\d\s-]{8,}\d)\b/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text) || /linkedin/i.test(text);
  const hasGitHub = /github\.com\//i.test(text) || /github/i.test(text);

  let comp = 0;
  if (hasEmail) comp += 3;
  if (hasPhone) comp += 3;
  if (hasLinkedIn) comp += 2;
  if (hasGitHub) comp += 2;
  breakdown.completeness = comp;

  const atsScore =
    breakdown.parseability +
    breakdown.sections +
    breakdown.keywords +
    breakdown.formatting +
    breakdown.completeness; 

  return {
    atsScore: Math.max(0, Math.min(100, atsScore)),
    breakdown: { ...breakdown, sectionsFound },
  };
}

module.exports = { computeATSScore };