// 修復 client/src/components/StoryForm.js

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Text,
  Badge,
  FormHelperText,
  useColorModeValue,
  HStack,
  Select,
  Flex,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { FiSend, FiFileText, FiTrash2, FiDownload } from 'react-icons/fi';
import LoadReportsDialog from './LoadReportsDialog';
import { getCompetencyOptions, getStoreCategoryOptions } from '../utils/formatters';

const MAX_CHARS = 300;

const StoryForm = React.forwardRef(({ 
  onSubmit, 
  isLoading, 
  onStoryChange, 
  onReportLoaded,
  currentReport
}, ref) => {
  const formRef = useRef(null);
  const [story, setStory] = useState('');
  const [competency, setCompetency] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const charsLeft = MAX_CHARS - story.length;
  const isOverLimit = charsLeft < 0;
  
  // 載入報告對話框
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 獲取選項
  const competencyOptions = getCompetencyOptions(false);
  const storeCategoryOptions = getStoreCategoryOptions(false);
  
  // 🔧 修復：移除自動覆蓋邏輯，只在真正需要時才填充表單
  // 這個 useEffect 只處理故事內容，不觸碰 select 的值
  useEffect(() => {
    if (currentReport && currentReport.originalStory && story === '') {
      // 只在表單為空時才自動填充故事
      setStory(currentReport.originalStory);
      if (onStoryChange) {
        onStoryChange(currentReport.originalStory);
      }
    }
  }, [currentReport, onStoryChange, story]);
  
  // 暴露重置方法給外部
  React.useImperativeHandle(ref, () => ({
    resetForm: () => {
      setStory('');
      setCompetency('');
      setStoreCategory('');
      if (onStoryChange) {
        onStoryChange('');
      }
      if (formRef.current) {
        formRef.current.reset();
      }
    },
    // 🔧 新增：專門用於載入報告的方法
    loadReport: (report) => {
      if (report.originalStory) {
        setStory(report.originalStory);
        if (onStoryChange) {
          onStoryChange(report.originalStory);
        }
      }
      if (report.competency) {
        setCompetency(report.competency);
      }
      if (report.storeCategory) {
        setStoreCategory(report.storeCategory);
      }
    }
  }));
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    setStory(e.target.value);
    if (onStoryChange) {
      onStoryChange(e.target.value);
    }
  };
  
  const handleCompetencyChange = (e) => {
    setCompetency(e.target.value);
  };
  
  const handleStoreCategoryChange = (e) => {
    setStoreCategory(e.target.value);
  };

  const resetFormInternal = () => {
    setStory('');
    setCompetency('');
    setStoreCategory('');
    if (onStoryChange) {
      onStoryChange('');
    }
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleClear = () => {
    resetFormInternal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (story.trim() && !isOverLimit && competency && storeCategory) {
      onSubmit(story, competency, storeCategory);
    }
  };

  const handleReportSelected = (report) => {
    if (report && onReportLoaded) {
      onReportLoaded(report);
    }
  };

  const handleSampleStory = () => {
    const storyTemplates = [
      `上個月，我們品牌推出新款香水時，我注意到許多顧客對於香調難以選擇。作為香水部門櫃姐，我主動整理了一份香調指南卡，並用精美瓶子製作了小樣供客人試聞。我還能根據顧客的穿著打扮和偏好，快速推薦最適合的香水。結果一個月內我的銷售額比目標高出30%，客戶回購率增加15%，主管還請我在部門會議分享我的銷售技巧。`,
      
      `去年春節檔期，我們化妝品專櫃人手不足，同時抱怨客多且等待時間長。身為資深櫃姐，我設計了一個快速諮詢流程，先詢問顧客的肌膚需求和預算，同時讓初級櫃姐負責結帳，我則專心做高端產品推薦和膚質解說。實施後，不僅客人等待時間減少60%，滿意度提高，櫃位銷售額也比去年同期增長了25%，成為商場內業績成長最快的專櫃。`,
      
      `在電子產品專區作為銷售顧問，我發現許多年長客人對數位產品有興趣但不敢嘗試。我主動為這類顧客設計了「數位生活體驗」專案，用淺顯的方式解說產品，甚至編寫簡易使用手冊給他們帶回家。我還建立了專屬Line群組，隨時為他們解答問題。三個月後，我的銀髮族客群增加了40%，他們帶來的銷售額成長了35%，讓我成為部門「最佳創新銷售」的獲獎者。`,
      
      `作為珠寶部門的銷售顧問，我發現很多男性客人來買禮物時顯得特別緊張無措。我開發了一套「禮物顧問」流程，從詢問收禮人的年齡、風格喜好、場合到預算，然後提供3個精準選項。我還會主動示範包裝、講解保養知識。這個方法讓我的男性客戶轉換率提高了45%，平均客單價增加20%，回頭率也比其他同事高出30%，讓主管指派我專門負責重要節日的男士購物諮詢。`,
      
      `在數位家電部門工作時，我發現顧客經常抱怨售後服務不佳。作為一線銷售，我主動建立了客戶資料庫，記錄每位客人購買的產品和喜好，設置提醒系統定期關懷，並主動學習產品維修知識。當客人有問題，我能在第一時間提供協助。半年後，我的客戶投訴率降低了70%，回頭客增加50%，許多顧客指名要我服務，並為我帶來更多轉介紹客人，使我連續三個月達成業績第一名。`
    ];
    
    const randomIndex = Math.floor(Math.random() * storyTemplates.length);
    const selectedStory = storyTemplates[randomIndex];
    
    setStory(selectedStory);
    if (onStoryChange) {
      onStoryChange(selectedStory);
    }
  };

  return (
    <Box 
      as="form" 
      ref={formRef}
      onSubmit={handleSubmit} 
      bg={bgColor} 
      borderRadius="lg" 
      p={{ base: 4, md: 6 }}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      width="100%" 
      maxWidth={{ base: "100%", md: "container.md", lg: "container.lg" }}
    >
      <VStack spacing={4} align="stretch">
        <Flex 
          justify={{ base: "center", sm: "flex-end" }}
          mb={{ base: 2, sm: 0 }}
        >
          <Button
            leftIcon={<FiDownload />}
            size="md" 
            variant="outline"
            colorScheme="teal"
            onClick={onOpen}
            width={{ base: "100%", sm: "auto" }}
          >
            載入報告
          </Button>
        </Flex>
        
        <FormControl isRequired>
          <FormLabel fontSize="md" fontWeight="medium" color={useColorModeValue("gray.700", "white")}>
            請選擇核心職能
          </FormLabel>
          <Select 
            placeholder="請選擇核心職能"
            value={competency}
            onChange={handleCompetencyChange}
            size="md"
          >
            {competencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel fontSize="md" fontWeight="medium" color={useColorModeValue("gray.700", "white")}>
            請選擇商店類別
          </FormLabel>
          <Select 
            placeholder="請選擇商店類別"
            value={storeCategory}
            onChange={handleStoreCategoryChange}
            size="md"
          >
            {storeCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      
        <FormControl isRequired isInvalid={isOverLimit}>
          <FormLabel fontSize="lg" fontWeight="medium" color={useColorModeValue("gray.700", "white")}>
            輸入你的故事
            <Badge ml={2} colorScheme={charsLeft < 50 ? (charsLeft < 0 ? 'red' : 'yellow') : 'green'}>
              {charsLeft} 字剩餘
            </Badge>
          </FormLabel>
          <Textarea
            value={story}
            onChange={handleChange}
            placeholder="描述一個你在職場上面臨的挑戰，以及你如何解決它的經驗..."
            size="lg"
            rows={8}
            resize="vertical"
            maxLength={MAX_CHARS + 10}
          />
          {isOverLimit ? (
            <FormHelperText color="red.500">
              已超過最大字數限制，請縮短你的故事
            </FormHelperText>
          ) : (
            <FormHelperText>
              描述一個有明確成果的職場挑戰經驗，以獲得更好的STAR結構報告
            </FormHelperText>
          )}
        </FormControl>

        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          spacing={{ base: 2, md: 4 }} 
          justify="space-between" 
          align={{ base: 'stretch', md: 'center' }} 
          mt={2}
        >
          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            spacing={2} 
            width={{ base: '100%', md: 'auto' }}
          >
            <Button
              leftIcon={<FiFileText />}
              variant="outline"
              onClick={handleSampleStory}
              size="md"
              width={{ base: '100%', sm: 'auto' }}
            >
              載入範本
            </Button>
            <Button
              leftIcon={<FiTrash2 />}
              variant="outline"
              onClick={handleClear}
              size="md"
              colorScheme="red"
              isDisabled={story.trim() === ''}
              width={{ base: '100%', sm: 'auto' }}
            >
              清除內容
            </Button>
          </Stack>
          <Button
            type="submit"
            leftIcon={<FiSend />}
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="生成中..."
            isDisabled={story.trim() === '' || isOverLimit || !competency || !storeCategory}
            size="md"
            width={{ base: '100%', md: 'auto' }}
            mt={{ base: 2, md: 0 }}
          >
            生成STAR報告
          </Button>
        </Stack>
      </VStack>

      <LoadReportsDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        onReportSelect={handleReportSelected} 
      />
    </Box>
  );
});

export default StoryForm;