import API_URL from "@/src/lib/api";

export const generateTopInterviewQuestions = async ({ role, experience }) => {
  const res = await API_URL.post(
    "/top-interview-questions/generate",
    { role, experience }
  );

  return res.data;
};