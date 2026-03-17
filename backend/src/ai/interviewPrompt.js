const buildTopInterviewQuestionsPrompt = ({ role, experience }) => {

return `
You are an expert technical interviewer.

Generate the top 15 most commonly asked interview questions and answers.

Role: ${role}
Experience: ${experience}

Rules:
1. Return exactly 15 questions.
2. Questions must be realistic and frequently asked in interviews.
3. Answers must be concise and interview-ready.
4. Tailor questions based on experience level.
5. Include fundamentals and practical coding questions.
6. Avoid duplicates.

Return valid JSON in this format:

{
"title": "string",
"role": "string",
"experience": "string",
"questions":[
{
"question":"string",
"answer":"string",
"category":"string",
"difficulty":"Easy | Medium | Hard"
}
]
}
`;
};

module.exports = { buildTopInterviewQuestionsPrompt };