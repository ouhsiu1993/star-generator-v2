import React, { useState, useContext, useEffect, useRef } from 'react';
import { Box, VStack, Heading, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import StoryForm from '../components/StoryForm';
import StarReport from '../components/StarReport';
import { AppContext } from '../App';
import apiService from '../utils/apiService';

const Home = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [story, setStory] = useState('');
  const [showReport, setShowReport] = useState(false); // 新增控制報告顯示的狀態
  const { setHasContent, setIsLoading: setAppLoading } = useContext(AppContext);
  const storyFormRef = useRef(null);
  
  // 同步本地和全局狀態
  useEffect(() => {
    // 當有報告或正在加載時，設置全局狀態
    setHasContent(!!report || story.trim().length > 0);
    setAppLoading(isLoading);
  }, [report, isLoading, story, setHasContent, setAppLoading]);
  
  // 監聽故事內容變化
  const handleStoryChange = (newStory) => {
    setStory(newStory);
    
    // 如果當前有報告，更新報告的原始故事
    if (report) {
      setReport(prevReport => ({
        ...prevReport,
        originalStory: newStory
      }));
    }
  };
  
  // 重置表單和移除報告顯示
  const resetForm = () => {
    setShowReport(false); // 隱藏報告區塊
    
    // 使用 ref 重置表單
    if (storyFormRef.current) {
      storyFormRef.current.resetForm();
    }
    
    // 返回頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成報告的函數 - 使用 API 服務
  const generateReport = async (story, competency, storeCategory) => {
    setIsLoading(true);
    
    try {
      // 調用 API 服務
      const response = await apiService.generateStarReport({ 
        story, 
        competency, 
        storeCategory 
      });
      
      // 確保報告數據包含 originalStory
      const reportData = {
        ...response.data,
        originalStory: story, // 確保設置原始故事
      };
      
      // 設置報告數據
      setReport(reportData);
      // 顯示報告區塊
      setShowReport(true);
      
      toast({
        title: '報告生成成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      
      toast({
        title: '報告生成失敗',
        description: error.response?.data?.error || '請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 處理載入報告
  const handleReportLoaded = (loadedReport) => {
    if (loadedReport) {
      // 設置報告數據
      setReport(loadedReport);
      // 顯示報告區塊
      setShowReport(true);
      
      // 如果報告有原始故事，設置故事狀態
      if (loadedReport.originalStory) {
        setStory(loadedReport.originalStory);
      }
      
      // 提示用戶
      toast({
        title: '報告載入成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      
      // 滾動到報告部分
      setTimeout(() => {
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  };

  return (
    <VStack spacing={8} my={8} align="stretch" maxWidth={{ base: "100%", md: "container.md", lg: "container.lg" }} mx="auto">
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
      
      <StoryForm 
        ref={storyFormRef} 
        onSubmit={generateReport} 
        isLoading={isLoading} 
        onStoryChange={handleStoryChange} 
        onReportLoaded={handleReportLoaded}
        currentReport={report} // 傳遞當前報告給表單
      />
      
      {/* 使用 showReport 控制報告顯示 */}
      {showReport && report && (
        <StarReport report={report} onNewReport={resetForm} />
      )}
    </VStack>
  );
};

export default Home;