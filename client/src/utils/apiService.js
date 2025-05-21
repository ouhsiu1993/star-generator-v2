import axios from 'axios';

// 設定基本URL
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 通用錯誤處理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// API服務函數
const apiService = {
  // 生成STAR報告
  generateStarReport: async (data) => {
    try {
      const response = await api.post('/api/generate', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 儲存報告
  saveReport: async (reportData) => {
    try {
      const response = await api.post('/api/reports', reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 獲取報告列表
  getReports: async (params = {}) => {
    try {
      const response = await api.get('/api/reports', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 根據 ID 獲取單個報告
  getReportById: async (id) => {
    try {
      const response = await api.get(`/api/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;