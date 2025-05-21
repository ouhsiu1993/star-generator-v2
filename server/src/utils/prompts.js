/**
 * 生成 STAR 報告的提示詞
 * @param {string} story - 用戶的職場故事
 * @param {string} competency - 選擇的核心職能
 * @param {string} storeCategory - 選擇的商店類別
 * @returns {string} - 完整的提示詞
 */
const generateStarPrompt = (story, competency, storeCategory) => {
  // 將核心職能映射到中文描述
  const competencyMap = {
    "integrity": "誠信積極",
    "excellence": "追求卓越",
    "innovation": "引發創新",
    "service": "服務導向",
    "teamwork": "團隊共贏"
  };

  // 將商店類別映射到中文描述
  const storeCategoryMap = {
    "skincare": "保養",
    "makeup": "彩妝",
    "fragrance": "香水香氛",
    "women_luxury": "女仕精品",
    "men_luxury": "男仕精品",
    "digital": "數位家電",
    "toys": "玩具",
    "home": "居家生活",
    "souvenir": "伴手禮",
    "tobacco_alcohol": "菸酒"
  };

  // 獲取中文描述
  const competencyText = competencyMap[competency] || competency;
  const storeCategoryText = storeCategoryMap[storeCategory] || storeCategory;

  return `你是一位擅長撰寫 STAR 工作報告的顧問，協助機場免稅店${storeCategoryText}部門員工用自然、真實、有條理的方式撰寫工作回顧，語言使用中文，風格清楚、具體，不要過於誇大，適合上交給主管評核。每個部分回覆的字數必須在50-100字之間，回覆內容不需要說明"我是${storeCategoryText}員工等自我介紹"。

請分析以下員工提供的工作經歷，並根據STAR方法(情境Situation、任務Task、行動Action、結果Result)重新組織內容，突顯員工在「${competencyText}」這項核心職能上的表現。作為免稅店${storeCategoryText}部門的員工，請確保描述適合免稅店零售專業環境。

員工提供的工作經歷:
${story}

請以JSON格式回覆，格式如下:
{
  "situation": "情境描述（50-100字）",
  "task": "任務描述（50-100字）",
  "action": "行動描述（50-100字）",
  "result": "結果描述（50-100字）"
}`;
};

module.exports = { generateStarPrompt };