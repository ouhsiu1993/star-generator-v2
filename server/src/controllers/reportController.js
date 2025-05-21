const { openai, config } = require('../config/openai');
const { generateStarPrompt } = require('../utils/prompts');
const Report = require('../models/Report');

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
      
      // 添加原始故事和類別信息到報告數據中
      reportData.originalStory = story;
      reportData.competency = competency;
      reportData.storeCategory = storeCategory;
      
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
          result: responseContent.substring(300, 400),
          competency,
          storeCategory,
          originalStory: story
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
 * 保存報告到數據庫
 * @param {Object} req - 包含報告數據的請求對象
 * @param {Object} res - 響應對象
 */
const saveReport = async (req, res) => {
  try {
    const { situation, task, action, result, competency, storeCategory, originalStory } = req.body;

    // 驗證必要欄位
    if (!situation || !task || !action || !result || !competency || !storeCategory) {
      return res.status(400).json({
        success: false,
        error: '報告缺少必要欄位'
      });
    }

    // 創建新報告
    const report = new Report({
      situation,
      task,
      action,
      result,
      competency,
      storeCategory,
      originalStory: originalStory || ''
    });

    // 保存到數據庫
    await report.save();

    // 返回成功響應和報告 ID
    res.status(201).json({
      success: true,
      message: '報告保存成功',
      data: { id: report._id }
    });
  } catch (error) {
    console.error('保存報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '保存報告時出錯: ' + error.message
    });
  }
};

/**
 * 獲取保存的報告
 * @param {Object} req - 請求對象，可能包含過濾條件
 * @param {Object} res - 響應對象
 */
const getReports = async (req, res) => {
  try {
    const { competency, storeCategory, limit = 10, page = 1 } = req.query;
    
    // 構建查詢條件
    const query = {};
    if (competency) query.competency = competency;
    if (storeCategory) query.storeCategory = storeCategory;
    
    // 計算跳過的文檔數量
    const skip = (page - 1) * limit;
    
    // 查詢數據庫
    const reports = await Report.find(query)
      .sort({ createdAt: -1 }) // 按創建時間降序排序
      .limit(parseInt(limit))
      .skip(skip);
    
    // 計算總數量，用於分頁
    const total = await Report.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('獲取報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '獲取報告時出錯: ' + error.message
    });
  }
};

/**
 * 根據 ID 獲取單個報告
 * @param {Object} req - 請求對象，包含報告 ID
 * @param {Object} res - 響應對象
 */
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查詢數據庫
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: '找不到此報告'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('獲取報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '獲取報告時出錯: ' + error.message
    });
  }
};

module.exports = {
  generateStarReport,
  saveReport,
  getReports,
  getReportById
};