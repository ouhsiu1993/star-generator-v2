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

  // 讀取歷史報告
  getReports: async () => {
    try {
      const response = await api.get('/api/reports');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;