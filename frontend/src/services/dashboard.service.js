import API_URL from "./api";

export const getDashboardData = async () => {
  const res = await API_URL.get("/dashboard", {
    withCredentials: true, 
    headers: {
      "Cache-Control": "no-cache", 
    },
  });

  return res.data;
};