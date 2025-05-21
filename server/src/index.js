const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const reportRoutes = require('./routes/reportRoutes');

require('dotenv').config();

// 初始化 Express 應用
const app = express();
const PORT = process.env.PORT || 5000;

// 設置安全中間件
app.use(helmet());

// 設置 CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 日誌中間件
app.use(morgan('combined'));

// 限流中間件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 每個 IP 15 分鐘內最多請求 100 次
  standardHeaders: true,
  message: '請求過於頻繁，請稍後再試。'
});

// 應用限流中間件
app.use(limiter);

// 解析 JSON 請求體
app.use(express.json());

// 路由設置
app.use('/api', reportRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.json({
    message: 'STAR 報告生成器 API 服務正常運行',
    status: 'online',
    time: new Date().toISOString()
  });
});

// 處理 404 錯誤
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '請求的資源不存在'
  });
});

// 處理全局錯誤
app.use((err, req, res, next) => {
  console.error('服務器錯誤:', err);
  
  res.status(500).json({
    success: false,
    error: '伺服器內部錯誤'
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});