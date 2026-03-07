import API_URL from "./api";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await API_URL.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const getMyResumes = async () => {
  const res = await API_URL.get("/resume/my");
  return res.data;
};


export const deleteResume = async (id) => {
  const res = await API_URL.delete(`/resume/${id}`);
  return res.data;
};