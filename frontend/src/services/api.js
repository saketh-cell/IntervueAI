import axios from "axios";

const API_URL = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

API_URL.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;

      const authPages = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
      ];

      if (!authPages.includes(path)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API_URL;