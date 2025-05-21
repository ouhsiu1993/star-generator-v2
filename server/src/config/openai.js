const { OpenAI } = require('openai');
require('dotenv').config();

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key',
});

// 配置參數 - 更新模型為當前支援的版本
const config = {
  model: process.env.OPENAI_MODEL || 'gpt-4.1',
  tokenLimit: parseInt(process.env.TOKEN_LIMIT || '100000', 10),
};

module.exports = { openai, config };