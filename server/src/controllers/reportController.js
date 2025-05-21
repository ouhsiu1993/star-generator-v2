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
    
    console.log('接收到的請求數據:', { story, competency, storeCategory });

    // 驗證是否提供了所有必要參數
    if (!story || !competency || !storeCategory) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數。請提供 story、competency 和 storeCategory。'
      });
    }

    // 生成提示詞
    const prompt = generateStarPrompt(story, competency, storeCategory);
    console.log('生成的提示詞:', prompt);

    // 調用 OpenAI API
    try {
      console.log('使用模型:', config.model);
      
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      console.log('OpenAI API 響應:', completion);
      
      // 解析 API 響應
      const responseContent = completion.choices[0]?.message?.content || '';
      
      console.log('獲得的內容:', responseContent);
      
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
        console.error('嘗試解析的內容:', responseContent);
        
        // 嘗試使用正則表達式提取 STAR 內容
        const situationMatch = responseContent.match(/\"situation\":\s*\"(.*?)\"/);
        const taskMatch = responseContent.match(/\"task\":\s*\"(.*?)\"/);
        const actionMatch = responseContent.match(/\"action\":\s*\"(.*?)\"/);
        const resultMatch = responseContent.match(/\"result\":\s*\"(.*?)\"/);

        // 如果可以通過正則提取內容
        if (situationMatch && taskMatch && actionMatch && resultMatch) {
          const extractedData = {
            situation: situationMatch[1],
            task: taskMatch[1],
            action: actionMatch[1],
            result: resultMatch[1],
            competency,
            storeCategory,
            originalStory: story
          };
          
          console.log('通過正則提取的數據:', extractedData);
          
          return res.status(200).json({
            success: true,
            data: extractedData
          });
        }
        
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
    } catch (openaiError) {
      console.error('OpenAI API 調用錯誤:', openaiError);
      
      // 檢查是否是模型不存在的錯誤
      if (openaiError.message && openaiError.message.includes('does not exist')) {
        // 使用備用模型
        console.log('嘗試使用備用模型');
        const backupModel = 'gpt-4.0';
        
        const completion = await openai.chat.completions.create({
          model: backupModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });
        
        const responseContent = completion.choices[0]?.message?.content || '';
        
        try {
          const reportData = JSON.parse(responseContent);
          reportData.originalStory = story;
          reportData.competency = competency;
          reportData.storeCategory = storeCategory;
          
          return res.status(200).json({
            success: true,
            data: reportData,
            note: '使用備用模型生成'
          });
        } catch (jsonError) {
          // 同樣的問題，返回簡單格式
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
            rawResponse: responseContent,
            note: '使用備用模型生成，但需要手動解析'
          });
        }
      } else {
        throw openaiError;
      }
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
    const { name, situation, task, action, result, competency, storeCategory, originalStory } = req.body;

    console.log('接收到的報告數據:', req.body); // 添加日誌以便調試

    // 驗證必要欄位
    if (!situation || !task || !action || !result || !competency || !storeCategory) {
      return res.status(400).json({
        success: false,
        error: '報告缺少必要欄位'
      });
    }

    // 創建新報告，確保包含 name 字段
    const report = new Report({
      name: name || '未命名報告', // 提供默認值以防 name 為空
      situation,
      task,
      action,
      result,
      competency,
      storeCategory,
      originalStory: originalStory || ''
    });

    console.log('準備保存報告:', report); // 添加日誌以便調試

    // 保存到數據庫
    await report.save();

    console.log('報告保存成功，ID:', report._id); // 添加日誌以便調試

    // 返回成功響應和報告 ID
    res.status(201).json({
      success: true,
      message: '報告保存成功',
      data: { id: report._id }
    });
  } catch (error) {
    console.error('保存報告錯誤:', error);
    
    // 如果錯誤涉及驗證失敗，提供更具體的錯誤消息
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: '驗證錯誤: ' + errors.join(', ')
      });
    }
    
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

/**
 * 刪除報告
 * @param {Object} req - 請求對象，包含報告 ID
 * @param {Object} res - 響應對象
 */
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查詢數據庫並刪除報告
    const result = await Report.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: '找不到此報告'
      });
    }
    
    res.status(200).json({
      success: true,
      message: '報告已成功刪除'
    });
  } catch (error) {
    console.error('刪除報告錯誤:', error);
    res.status(500).json({
      success: false,
      error: '刪除報告時出錯: ' + error.message
    });
  }
};

module.exports = {
  generateStarReport,
  saveReport,
  getReports,
  getReportById,
  deleteReport
};