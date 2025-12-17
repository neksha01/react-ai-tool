import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-tool-backend-1-1ite.onrender.com",
});

// ✅ Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
