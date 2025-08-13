import axios from 'axios';
import { API_ENDPOINTS } from '../../../constants/endPoint.constants';

// Member API용 axios 인스턴스 (8080)
export const memberAxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.MEMBER_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API용 axios 인스턴스 (8081)
export const chatAxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.CHAT_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 기본 axios 인스턴스 (Member API 사용)
export const axiosInstance = memberAxiosInstance;

// Request interceptor for Member API
memberAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for Member API
memberAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Request interceptor for Chat API
chatAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for Chat API
chatAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 