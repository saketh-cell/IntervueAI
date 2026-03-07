import API_URL from "./api";

export const loginUser = async (data) => {
  const res = await API_URL.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API_URL.post("/auth/register", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await API_URL.post("/auth/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await API_URL.get("/auth/profile");
  return res.data;
};