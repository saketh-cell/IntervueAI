// src/services/password.service.js
import API_URL from "./api";

export const sendResetOtp = async (email) => {
  const res = await API_URL.post("/password/forgot-password", { email });
  return res.data;
};

export const verifyResetOtp = async (email, otp) => {
  const res = await API_URL.post("/password/verify-otp", { email, otp });
  return res.data;
};

export const resetPassword = async (email, newPassword) => {
  const res = await API_URL.post("/password/reset-password", { email, newPassword });
  return res.data;
};