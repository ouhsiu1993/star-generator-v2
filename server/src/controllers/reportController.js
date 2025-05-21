const { openai, config } = require('../config/openai');
const { generateStarPrompt } = require('../utils/prompts');

/**
 * 生成 STAR 報告
 * @param {Object} req - 請求對象，包含 story、competency、storeCategory
 * @param {Object} res - 響應對象
 */
const generateStarReport = async (req, res) => {
  try {
    const { story, competency, storeCategory } = req.body;

    // 驗證是否提供了所有必要參數
    if (!story || !competency || !storeCategory) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數。請提供 story、competency 和 storeCategory。'
      });
    }

    // 生成提示詞
    const prompt = generateStarPrompt(story, competency, storeCategory);

    // 調用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    // 解析 API 響應
    const responseContent = completion.choices[0]?.message?.content || '';
    
    // 嘗試將 JSON 字符串解析為對象
    try {
      const reportData = JSON.parse(responseContent);
      
      // 驗證 reportData 是否包含預期的屬性
      if (!reportData.situation || !reportData.task || !reportData.action || !reportData.result) {
        throw new Error('OpenAI 回應格式不正確');
      }
      
      // 返回成功響應
      return res.status(200).json({
        success: true,
        data: reportData
      });
    } catch (jsonError) {
      console.error('JSON 解析錯誤:', jsonError);
      
      // 如果不是有效的 JSON，嘗試以簡單格式返回
      return res.status(200).json({
        success: true,
        data: {
          situation: responseContent.substring(0, 100),
          task: responseContent.substring(100, 200),
          action: responseContent.substring(200, 300),
          result: responseContent.substring(300, 400)
        },
        rawResponse: responseContent
      });
    }
  } catch (error) {
    console.error('生成 STAR 報告錯誤:', error);
    
    return res.status(500).json({
      success: false,
      error: `生成 STAR 報告時出錯: ${error.message || '未知錯誤'}`
    });
  }
};

/**
 * 保存報告到數據庫（未實現，僅占位）
 */
const saveReport = async (req, res) => {
  try {
    // 實際應用中，這裡會保存報告到數據庫
    res.status(200).json({
      success: true,
      message: '報告保存成功',
      data: { id: Math.random().toString(36).substring(7) }
    });
  } catch (error) {
    console.error('保存報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '保存報告時出錯'
    });
  }
};

/**
 * 獲取保存的報告（未實現，僅占位）
 */
const getReports = async (req, res) => {
  try {
    // 實際應用中，這裡會從數據庫獲取報告
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('獲取報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '獲取報告時出錯'
    });
  }
};

module.exports = {
  generateStarReport,
  saveReport,
  getReports
};