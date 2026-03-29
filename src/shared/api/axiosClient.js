import axios from "axios";
import { env } from "../../app/config/env";
import { clearAuthStorage, getAccessToken } from "../services/tokenClient";

const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
