const { OpenAI } = require('openai');
require('dotenv').config();

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 配置參數
const config = {
  model: process.env.OPENAI_MODEL || 'gpt-4.1',
  tokenLimit: parseInt(process.env.TOKEN_LIMIT || '1000000', 10),
};

module.exports = { openai, config };