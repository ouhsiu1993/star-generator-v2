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
      
      // 設置報告數據
      setReport(response.data);
      
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