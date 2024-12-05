import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/meetings";

export const uploadTranscript = (file, title, duration) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("duration", duration);

  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllMeetings = () => {
  return axios.get(`${API_BASE_URL}`);
};

export const getMeetingById = (id) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};

export const downloadReport = (id) => {
  return axios.get(`${API_BASE_URL}/download/report/${id}`, {
    responseType: "blob", // Ensure file download
  });
};
