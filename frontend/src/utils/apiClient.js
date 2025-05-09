import axios from "axios";

const baseURL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor untuk menambahkan token JWT jika ada
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;