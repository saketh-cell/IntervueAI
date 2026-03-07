const buildQuestionPrompt = (role, level) => `
You are a senior technical interviewer.

Generate exactly 10 interview questions for:
Role: ${role}
Experience Level: ${level}

Rules:
- Mix technical and behavioral questions.
- Keep each question short and clear.
- Do NOT add numbering like "1.", "2." inside the question text.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "questions": ["question1", "question2", "question3", "question4", "question5", "question6", "question7", "question8", "question9", "question10"]
}
`.trim();

const buildResumePrompt = (resumeText) => `
You are an expert resume reviewer.

Analyze the resume text below and return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "overallScore": 0,
  "strengths": ["", "", ""],
  "weaknesses": ["", "", ""],
  "suggestions": ["", "", ""]
}

Rules:
- overallScore must be a number from 0 to 100.
- strengths: exactly 3 short bullet points.
- weaknesses: exactly 3 short bullet points.
- suggestions: exactly 3 actionable, specific improvements.
- Do not include any keys other than overallScore, strengths, weaknesses, suggestions.

Resume Text:
<<<
${String(resumeText || "").slice(0, 5000)}
>>>
`.trim();

const buildAnswerEvaluationPrompt = (question, answer) => `
You are a strict but fair technical interviewer.

Evaluate the candidate's answer.

Interview Question:
${question}

Candidate's Answer:
${answer}

Scoring rules:
- score must be a number between 0 and 100.
- If answer is empty/irrelevant: score below 30.
- If partially correct: score 40 to 70.
- If strong and detailed: score 75 to 95.
- Be realistic. Do not always give high scores.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "feedback": "Short, constructive feedback.",
  "score": 0
}
`.trim();

module.exports = {
  buildQuestionPrompt,
  buildResumePrompt,
  buildAnswerEvaluationPrompt,
};