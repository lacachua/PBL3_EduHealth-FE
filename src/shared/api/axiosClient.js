import axios from "axios";

const resolveBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    console.warn("[axiosClient] VITE_API_BASE_URL is undefined. Check your .env and restart dev server.");
  }

  return baseUrl;
};

const axiosClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
