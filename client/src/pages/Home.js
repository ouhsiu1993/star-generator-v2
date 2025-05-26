// 修復 client/src/pages/Home.js 中的狀態同步問題

import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Box, VStack, Heading, Text, useToast, useColorModeValue, Container } from '@chakra-ui/react';
import StoryForm from '../components/StoryForm';
import StarReport from '../components/StarReport';
import { AppContext } from '../App';
import apiService from '../utils/apiService';

const Home = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [story, setStory] = useState('');
  const [showReport, setShowReport] = useState(false);
  const { setHasContent, setIsLoading: setAppLoading } = useContext(AppContext);
  const storyFormRef = useRef(null);
  
  // 🔧 修復：簡化狀態同步邏輯，不要讓它影響表單
  useEffect(() => {
    // 只設置全局內容狀態，不影響加載狀態
    setHasContent(!!report || story.trim().length > 0);
    // 注意：這裡不要同步 isLoading 到全局，避免影響表單
  }, [report, story, setHasContent]);
  
  // 🔧 修復：單獨管理全局加載狀態，避免干擾表單
  useEffect(() => {
    setAppLoading(isLoading);
  }, [isLoading, setAppLoading]);
  
  // 🔧 修復：使用 useCallback 確保函數穩定，避免無限重新渲染
  const handleStoryChange = useCallback((newStory) => {
    setStory(newStory);
    
    if (report) {
      setReport(prevReport => ({
        ...prevReport,
        originalStory: newStory
      }));
    }
  }, [report]);
  
  // 重置表單和移除報告顯示
  const resetForm = () => {
    setShowReport(false);
    
    if (storyFormRef.current) {
      storyFormRef.current.resetForm();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成報告的函數
  const generateReport = async (story, competency, storeCategory) => {
    setIsLoading(true);
    
    try {
      const response = await apiService.generateStarReport({ 
        story, 
        competency, 
        storeCategory 
      });
      
      const reportData = {
        ...response.data,
        originalStory: story,
      };
      
      setReport(reportData);
      setShowReport(true);
      
      toast({
        title: '報告生成成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      
      setTimeout(() => {
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
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
      setReport(loadedReport);
      setShowReport(true);
      
      if (loadedReport.originalStory) {
        setStory(loadedReport.originalStory);
      }
      
      // 🔧 修復：使用新的 loadReport 方法來填充表單
      if (storyFormRef.current) {
        storyFormRef.current.loadReport(loadedReport);
      }
      
      toast({
        title: '報告載入成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      
      setTimeout(() => {
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  };

  return (
    <Container maxW={{ base: "100%", md: "container.md", lg: "container.lg" }} px={{ base: 2, md: 4 }}>
      <VStack spacing={6} my={6} align="stretch">
        <Box textAlign="center" mb={{ base: 0, md: 2 }}>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={3} color={useColorModeValue("gray.700", "white")}>
            STAR 報告產生器
          </Heading>
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            color={useColorModeValue("gray.500", "gray.400")} 
            maxW="container.md" 
            mx="auto"
            fontWeight="medium"
            px={2}
          >
            輸入職場鬼故事讓 AI 生成 STAR 報告
          </Text>
        </Box>
        
        <StoryForm 
          ref={storyFormRef} 
          onSubmit={generateReport} 
          isLoading={isLoading} 
          onStoryChange={handleStoryChange} 
          onReportLoaded={handleReportLoaded}
          currentReport={report}
        />
        
        {showReport && report && (
          <StarReport report={report} onNewReport={resetForm} />
        )}
      </VStack>
    </Container>
  );
};

export default Home;