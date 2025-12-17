import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-tool-backend-1-1ite.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    //  Only attach token if it exists
    if (token && !config.url.includes("/login") && !config.url.includes("/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default API;
