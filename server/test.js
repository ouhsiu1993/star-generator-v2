/**
 * 這是一個用於排查 STAR 報告產生器後端問題的工具腳本
 * 運行方式: node test.js
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('======= STAR 報告產生器故障診斷工具 =======');
console.log('開始診斷環境...\n');

// 檢查環境變數
console.log('1. 檢查環境變數:');
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'MONGODB_URI'
];

const missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    console.log(`  ❌ 缺少 ${varName}`);
  } else {
    // 對於 API KEY，只顯示部分資訊
    if (varName === 'OPENAI_API_KEY') {
      const key = process.env[varName];
      const maskedKey = key.substring(0, 3) + '...' + key.substring(key.length - 4);
      console.log(`  ✅ ${varName} 已設置: ${maskedKey}`);
    } else {
      console.log(`  ✅ ${varName} 已設置: ${process.env[varName]}`);
    }
  }
});

if (missingVars.length > 0) {
  console.log(`\n⚠️ 警告: 缺少 ${missingVars.length} 個必要的環境變數。請在 .env 檔案中設置它們。`);
} else {
  console.log('\n✅ 所有必要的環境變數都已設置。');
}

// 測試 OpenAI API 連接
console.log('\n2. 測試 OpenAI API 連接:');
async function testOpenAI() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log(`  正在使用模型: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}`);
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: "user", content: "Hello, are you working?" }],
      max_tokens: 10
    });
    
    console.log(`  ✅ OpenAI API 連接成功!`);
    console.log(`  回應: "${completion.choices[0]?.message?.content}"`);
  } catch (error) {
    console.log(`  ❌ OpenAI API 連接失敗: ${error.message}`);
    console.log(`  詳細錯誤: ${JSON.stringify(error, null, 2)}`);
    
    if (error.message.includes('API key')) {
      console.log('  💡 提示: 你的 API 金鑰似乎無效或不正確。請確保在 .env 文件中設置了正確的 OPENAI_API_KEY。');
    }
    
    if (error.message.includes('does not exist')) {
      console.log('  💡 提示: 指定的模型不存在或不可用。請嘗試更改 OPENAI_MODEL 環境變數為 "gpt-3.5-turbo"。');
    }
  }
}

// 測試 MongoDB 連接
console.log('\n3. 測試 MongoDB 連接:');
async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`  ✅ MongoDB 連接成功!`);
    console.log(`  連接到: ${mongoose.connection.host}`);
    await mongoose.disconnect();
  } catch (error) {
    console.log(`  ❌ MongoDB 連接失敗: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('  💡 提示: 找不到資料庫主機。請檢查 MONGODB_URI 是否正確。');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('  💡 提示: 連接被拒絕。請確保 MongoDB 服務正在運行並可訪問。');
    } else if (error.message.includes('Authentication failed')) {
      console.log('  💡 提示: 認證失敗。請檢查 MONGODB_URI 中的用戶名和密碼。');
    }
  }
}

// 測試提示詞生成
console.log('\n4. 測試提示詞生成功能:');
function testPromptGeneration() {
  try {
    const promptsPath = path.join(__dirname, 'src', 'utils', 'prompts.js');
    
    if (fs.existsSync(promptsPath)) {
      console.log('  ✅ prompts.js 文件存在');
      
      const { generateStarPrompt } = require('./src/utils/prompts');
      
      if (typeof generateStarPrompt === 'function') {
        const testPrompt = generateStarPrompt(
          '這是一個測試故事',
          'integrity',
          'skincare'
        );
        
        console.log('  ✅ generateStarPrompt 函數正常工作');
        console.log(`  生成的提示詞(節選): ${testPrompt.substring(0, 50)}...`);
      } else {
        console.log('  ❌ generateStarPrompt 不是一個函數');
      }
    } else {
      console.log('  ❌ 找不到 prompts.js 文件');
    }
  } catch (error) {
    console.log(`  ❌ 提示詞生成測試失敗: ${error.message}`);
  }
}

// 執行所有測試
async function runTests() {
  await testOpenAI();
  await testMongoDB();
  testPromptGeneration();
  
  console.log('\n===== 診斷摘要 =====');
  console.log('如果上述所有測試都通過，系統應該能夠正常運行。');
  console.log('如果有任何測試失敗，請根據提供的提示修復問題。');
  console.log('\n解決建議:');
  console.log('1. 確保所有環境變數正確設置在 .env 文件中');
  console.log('2. 確保 OpenAI API 金鑰有效，並有足夠的配額');
  console.log('3. 確保 MongoDB 資料庫已經設置，且憑證正確');
  console.log('4. 如果使用的是舊版 OpenAI 模型，請更新為較新的可用模型 (如 gpt-3.5-turbo)');
  console.log('5. 檢查是否有網絡問題或防火牆阻擋');
  console.log('\n祝你好運！');
}

runTests();