/**
 * 格式化日期
 * @param {string|Date} dateString - 日期字符串或日期對象
 * @param {Object} options - 格式化選項
 * @returns {string} - 格式化後的日期字符串
 */
export const formatDate = (dateString, options = {}) => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return date.toLocaleDateString('zh-TW', defaultOptions);
};

/**
 * 將英文核心職能代碼映射為中文名稱
 * @param {string} competencyCode - 核心職能代碼
 * @returns {string} - 中文名稱
 */
export const getCompetencyName = (competencyCode) => {
  const competencyMap = {
    "integrity": "誠信積極",
    "excellence": "追求卓越",
    "innovation": "引發創新",
    "service": "服務導向",
    "teamwork": "團隊共贏"
  };
  
  return competencyMap[competencyCode] || competencyCode;
};

/**
 * 將英文商店類別代碼映射為中文名稱
 * @param {string} categoryCode - 商店類別代碼
 * @returns {string} - 中文名稱
 */
export const getStoreCategoryName = (categoryCode) => {
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
  
  return storeCategoryMap[categoryCode] || categoryCode;
};

/**
 * 截斷文本並添加省略號
 * @param {string} text - 要截斷的文本
 * @param {number} maxLength - 最大長度
 * @returns {string} - 截斷後的文本
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

/**
 * 獲取所有核心職能選項
 * @param {boolean} includeEmpty - 是否包含空選項
 * @returns {Array} - 選項數組
 */
export const getCompetencyOptions = (includeEmpty = true) => {
  const options = [
    { value: "integrity", label: "誠信積極" },
    { value: "excellence", label: "追求卓越" },
    { value: "innovation", label: "引發創新" },
    { value: "service", label: "服務導向" },
    { value: "teamwork", label: "團隊共贏" }
  ];
  
  if (includeEmpty) {
    return [{ value: "", label: "所有核心職能" }, ...options];
  }
  
  return options;
};

/**
 * 獲取所有商店類別選項
 * @param {boolean} includeEmpty - 是否包含空選項
 * @returns {Array} - 選項數組
 */
export const getStoreCategoryOptions = (includeEmpty = true) => {
  const options = [
    { value: "skincare", label: "保養" },
    { value: "makeup", label: "彩妝" },
    { value: "fragrance", label: "香水香氛" },
    { value: "women_luxury", label: "女仕精品" },
    { value: "men_luxury", label: "男仕精品" },
    { value: "digital", label: "數位家電" },
    { value: "toys", label: "玩具" },
    { value: "home", label: "居家生活" },
    { value: "souvenir", label: "伴手禮" },
    { value: "tobacco_alcohol", label: "菸酒" }
  ];
  
  if (includeEmpty) {
    return [{ value: "", label: "所有商店類別" }, ...options];
  }
  
  return options;
};

/**
 * 格式化報告文本，用於複製或匯出
 * @param {Object} report - 報告對象
 * @returns {string} - 格式化後的文本
 */
export const formatReportText = (report) => {
  if (!report) return '';
  
  return `STAR 報告：
    
情境 (Situation):
${report.situation}

任務 (Task):
${report.task}

行動 (Action):
${report.action}

結果 (Result):
${report.result}

類別: ${getStoreCategoryName(report.storeCategory)}
職能: ${getCompetencyName(report.competency)}
生成時間: ${formatDate(report.createdAt || new Date())}`;
};