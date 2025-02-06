import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Nếu cần gửi token trong header
axiosInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem('userData'));  // Lấy userData từ localStorage
  if (userData && userData.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

export default axiosInstance;
