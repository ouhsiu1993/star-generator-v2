import React, { useState, useContext, useEffect, useRef } from 'react';
import { Box, VStack, Heading, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import StoryForm from '../components/StoryForm';
import StarReport from '../components/StarReport';
import { AppContext } from '../App';

const Home = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [story, setStory] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const { setHasContent, setIsLoading: setAppLoading } = useContext(AppContext);
  const storyFormRef = useRef(null);
  
  // 同步本地和全局狀態
  useEffect(() => {
    // 當有報告或正在加載時，設置全局狀態
    setHasContent(!!report || story.trim().length > 0);
    setAppLoading(isLoading);
    
    // 如果有報告，禁用表單
    if (report) {
      setIsFormDisabled(true);
    }
  }, [report, isLoading, story, setHasContent, setAppLoading]);
  
  // 監聽故事內容變化
  const handleStoryChange = (newStory) => {
    setStory(newStory);
  };
  
  // 重置表單和報告
  const resetForm = () => {
    setIsFormDisabled(false);
    setReport(null);
    setStory('');
    
    // 使用 ref 重置表單
    if (storyFormRef.current) {
      storyFormRef.current.resetForm();
    }
    
    // 返回頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 這個函數將在實際整合後端API時被修改
  const generateReport = async (story, competency, storeCategory) => {
    setIsLoading(true);
    
    try {
      // 模擬API呼叫
      // 實際整合時將替換為真實API呼叫
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根據用戶輸入的故事和選擇的職能生成模擬報告內容
      const storyWords = story.split(/\s+/).filter(word => word.length > 0);
      const randomNum = Math.floor(Math.random() * 10) + 1;
      
      // 根據不同的核心職能調整報告內容
      const competencyFocus = {
        "integrity": "誠信與積極主動的態度",
        "excellence": "追求卓越與高品質的標準",
        "innovation": "創新思維與解決問題的能力",
        "service": "以服務為導向的專業精神",
        "teamwork": "團隊合作與共同目標的達成"
      };
      
      // 根據不同的商店類別調整報告內容
      const storeCategoryContext = {
        "skincare": "保養品客戶諮詢與產品推薦",
        "makeup": "彩妝產品展示與顧客妝容指導",
        "fragrance": "香水香氛的專業介紹與顧客喜好匹配",
        "women_luxury": "女仕精品的時尚趨勢與個人風格建議",
        "men_luxury": "男仕精品的質感體驗與專業搭配",
        "digital": "數位家電的功能展示與操作說明",
        "toys": "玩具產品的安全性與趣味性呈現",
        "home": "居家生活用品的實用性與美觀度平衡",
        "souvenir": "伴手禮的文化意義與送禮場合建議",
        "tobacco_alcohol": "菸酒產品的專業知識與法規遵循"
      };
      
      // 從故事中提取部分關鍵字
      const extractKeywords = (text, count = 3) => {
        const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                         .split(/\s+/)
                         .filter(word => word.length > 2);
        const uniqueWords = [...new Set(words)];
        const keywords = [];
        
        for (let i = 0; i < Math.min(count, uniqueWords.length); i++) {
          const randomIndex = Math.floor(Math.random() * uniqueWords.length);
          keywords.push(uniqueWords[randomIndex]);
          uniqueWords.splice(randomIndex, 1);
        }
        
        return keywords.join('、');
      };
      
      const selectedFocus = competencyFocus[competency] || "專業能力與積極態度";
      const selectedContext = storeCategoryContext[storeCategory] || "零售服務與顧客體驗";
      
      const mockReport = {
        situation: `在${selectedContext}的工作環境中，團隊面臨${randomNum}個具有挑戰性的問題，涉及${extractKeywords(story)}等方面。這種情況特別需要展現${selectedFocus}來找到快速有效的解決方案。`,
        task: `作為${storeCategory === "digital" || storeCategory === "toys" || storeCategory === "home" ? "專業顧問" : "銷售顧問"}，你需要展現${selectedFocus}，組織資源，規劃策略，並確保所有與${selectedContext}相關的${extractKeywords(story, 2)}工作能夠順利完成，同時保持團隊的高效運作。`,
        action: `你首先展現了${selectedFocus}，進行了全面分析，識別出在${selectedContext}中的關鍵問題點，然後制定了包含${randomNum + 2}個步驟的行動計劃。在執行過程中，你特別注重與${extractKeywords(story, 1)}相關的部分，並且不斷調整優化方案。`,
        result: `通過一系列展現${selectedFocus}的行動，最終在${selectedContext}領域成功解決了問題，提高了${randomNum * 10}%的效率，獲得了團隊和管理層的一致好評。這次經驗也成為了團隊解決類似問題的參考案例。`
      };
      
      setReport(mockReport);
      toast({
        title: '報告生成成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: '報告生成失敗',
        description: '請稍後再試',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={8} my={8} align="stretch">
      <Box textAlign="center" mb={2}>
        <Heading as="h2" size="xl" mb={4} color={useColorModeValue("gray.700", "white")}>
          STAR 報告產生器
        </Heading>
        <Text 
          fontSize="lg" 
          color={useColorModeValue("gray.500", "gray.400")} 
          maxW="container.md" 
          mx="auto"
          fontWeight="medium"
        >
          系統將根據故事內容自動生成結構化的STAR報告
        </Text>
      </Box>
      
      <StoryForm ref={storyFormRef} onSubmit={generateReport} isLoading={isLoading} onStoryChange={handleStoryChange} isDisabled={isFormDisabled} />
      
      {report && <StarReport report={report} onNewReport={resetForm} />}
    </VStack>
  );
};

export default Home;