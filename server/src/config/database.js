const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB 連接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ouhsiu:oyMifOpfCI9cLskQ@star-generator.m9o5sl8.mongodb.net/?retryWrites=true&w=majority&appName=star-generator';

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
    process.exit(1);
  }
};

module.exports = { connectDB };