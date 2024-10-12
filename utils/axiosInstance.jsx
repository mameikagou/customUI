
import axios from 'axios';

// 创建一个 Axios 实例
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // 设置基础URL
  timeout: 10000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json', // 设置请求头
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 或其他请求头
    const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 可以在这里处理响应数据
    return response.data; // 直接返回响应数据
  },
  (error) => {
    // 可以在这里处理错误
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default axiosInstance;
