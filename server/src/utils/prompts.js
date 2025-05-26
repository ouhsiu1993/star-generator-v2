/**
 * 核心職能詳細定義
 */
const coreCompetencies = {
  "integrity": {
    name: "誠信積極",
    definition: "展現真誠，保持言行一致，遵從道德與倫理、專業與組織的準則，對自己的優劣勢有充分了解，對自己的行為對他人的影響有所覺察，努力贏得他人的對個人或組織的信任。主動採取行動以確保達標或超越要求，展現積極熱忱的態度。",
    keyBehaviors: [
      "遵守道德與倫理、專業標準、規章及組織政策，展現真誠態度，並做出行動來實現所做的承諾，確保言談舉止在不同情況下保持一致",
      "願意分享個人想法、意見、觀點與立場，尊重並平等對待他人，既使遭遇不同意見或挑戰也能支持他人好的想法",
      "當發生錯誤時，能勇於負責並承認錯誤，採取適當因應措施",
      "了解自己的發展目標與目前的發展狀況，積極尋求他人平衡回饋，願意考慮他人的回饋意見並適當調整自己的行為",
      "遇到問題或需要有所回應時，能立即採取行動，願意超越工作範圍要求的行動，以更好地達成目標"
    ]
  },
  
  "excellence": {
    name: "追求卓越",
    definition: "為他人及自己設立高績效檢驗的標準，對成功完成任務有強烈使命感。面臨困難挑戰或挫敗拒絕的情境，能妥善處理並繼續保持工作效率。",
    keyBehaviors: [
      "建立一套卓越的工作模式或流程以達到高標準的品質及服務",
      "致力確保高品質，為工作投注所需時間和精力，確保顧及該有層面且沒有遺漏處，努力克服任務過程中所碰到的障礙",
      "面對工作進度要求和工作挑戰仍將注意力保持在重要任務上，有效管理相衝突的不同要求",
      "能在遭遇挫折後繼續維持工作效率，把挫折視為挑戰，盡職負責並持續努力，展現全力以赴的態度"
    ]
  },
  
  "innovation": {
    name: "引發創新",
    definition: "嘗試不同或新的觀點或方式來處理問題或機會，持續發展創新且可行的解決方法。面對挑戰或困難時展現正面思考，願意展現正向能量協助他人看見機會所在，主動尋求學習機會並將學習所得落實運用在工作中。",
    keyBehaviors: [
      "願意去思考問題背後的可能假設，用不同角度來看待問題，挑戰既定觀點或模式，不被既有想法或做法限制",
      "願意在變動或困難情境中看到正面意義，鼓勵他人採取正面態度看待變化或困難",
      "向不同的人或來源尋求創意想法，擴大思考範圍，在不相關想法上找出可能的關聯性，願意與他人腦力激盪想出不同解決方式",
      "致力找出將所學新知識或技巧實際應用在工作上的機會，承擔學習過程中可能產生的風險，願意挑戰性或尚未熟悉的任務"
    ]
  },
  
  "service": {
    name: "服務導向",
    definition: "致力瞭解內外部客戶，將符合內外部客戶的需要視為較為優先的要務。與內外部顧客尋求建立及持續維持良性合作關係。",
    keyBehaviors: [
      "主動尋求更多管道或資訊來了解內外部客戶面臨的情境、問題、期望及需要",
      "與內外部客戶分享資訊，幫助內外部客戶了解所處狀況及可提供服務，適時教育客戶",
      "運用適當人際技巧，邀請內外部客戶參與意見，致力與內外部客戶尋求建立及維持良性合作關係",
      "考量所採取的行動或計劃會對內外部客戶產生什麼影響，迅速回應內外部客戶需求或問題，並留意避免過度承諾",
      "運用有效方法來了解並評估內外部客戶的考量、問題及滿意度，並預期內外部客戶的潛在需求"
    ]
  },
  
  "teamwork": {
    name: "團隊共贏",
    definition: "善盡個人在團隊中的職責，展現投入與支持團隊，積極參與團隊的任務，以促進團隊達成目標。",
    keyBehaviors: [
      "瞭解自身在團隊中扮演的職責與角色，以完成團隊目標或執行團隊任務為己任",
      "以身作則，切實遵守團隊的期許及規範，履行團隊賦予的責任及個人對團隊的承諾",
      "在團隊討論時能傾聽他人意見，邀請他人參與團隊決策或行動，與團隊成員分享重要且與工作相關的訊息",
      "全力投入，提供必要資源或協助移除障礙，與成員合作以幫助團隊完成目標，尋求共贏的可能性",
      "重視、欣賞並善用團隊成員間不同的才能與專長，找出團隊合作的最大綜效"
    ]
  }
};

/**
 * 生成 STAR 報告的提示詞 - 保留原有內容並新增職能定義
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

  // 獲取職能詳細資訊
  const competencyInfo = coreCompetencies[competency];
  
  // 構建職能定義和關鍵行為描述
  let competencyDetails = '';
  if (competencyInfo) {
    const keyBehaviorsList = competencyInfo.keyBehaviors.map((behavior, index) => `${index + 1}. ${behavior}`).join('\n');
    
    competencyDetails = `

【${competencyInfo.name} 職能定義】
${competencyInfo.definition}

【關鍵行為】
${keyBehaviorsList}`;
  }

  return `你是一位擅長撰寫 STAR 工作報告的顧問，協助機場免稅店${storeCategoryText}部門員工用自然、真實、有條理的方式撰寫工作回顧，語言使用中文，風格清楚、具體、口語化，不要過於誇大、不要過於 AI 感，適合上交給主管評核。每個部分回覆的字數必須在50-100字之間，回覆內容不需要說明"我是${storeCategoryText}員工等自我介紹"。

請分析以下員工提供的工作經歷，並根據STAR方法(情境Situation、任務Task、行動Action、結果Result)重新組織內容，突顯員工在「${competencyText}」這項核心職能上的表現。作為免稅店${storeCategoryText}部門的員工，請確保描述適合免稅店零售專業環境。${competencyDetails}

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

module.exports = { 
  generateStarPrompt,
  coreCompetencies // 導出職能定義供其他模組使用
};