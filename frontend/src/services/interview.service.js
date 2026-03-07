import API from "./api";

export const startInterview = async (interviewData) => {
  const response = await API.post("/interview/start", interviewData);
  return response.data;
};

export const submitAnswer = async ({ interviewId, questionIndex, answer }) => {
  const response = await API.post(
    `/interview/${interviewId}/answer/${questionIndex}`,
    { answer }
  );
  return response.data;
};

export const completeInterview = async (interviewId) => {
  const response = await API.post(`/interview/${interviewId}/complete`);
  return response.data;
};

export const getInterview = async (interviewId) => {
  const response = await API.get(`/interview/${interviewId}`);
  return response.data;
};

export const getMyInterviewSessions = async (status = "") => {
  const query = status ? `?status=${status}` : "";
  const response = await API.get(`/interview/my-sessions${query}`);
  return response.data;
};