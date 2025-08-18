import axios from "axios";
import { config } from "../../constants/config";
import { getCookie } from "../utils/cookieUtils";

export const axiosInstance = axios.create({
  timeout: config.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 포함한 요청을 허용
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
