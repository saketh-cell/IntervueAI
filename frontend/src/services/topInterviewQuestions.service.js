import API_URL from "./api.js";

export const generateTopInterviewQuestions = async ({ role, experience }) => {
  const res = await API_URL.post(
    "/top-interview-questions/generate",
    { role, experience }
  );

  return res.data;
};