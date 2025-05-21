const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB 連接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/star-generator';

// 連接配置
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// 連接數據庫
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB 連接成功: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB 連接錯誤: ${error.message}`);
    // 不要在生產環境中退出進程，可以繼續提供服務，只是無法存儲數據
    if (process.env.NODE_ENV === 'production') {
      console.error('繼續提供服務，但無法儲存報告');
    } else {
      process.exit(1);
    }
  }
};

module.exports = { connectDB };