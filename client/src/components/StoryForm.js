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
} from '@chakra-ui/react';
import { FiSend, FiFileText, FiTrash2, FiDownload } from 'react-icons/fi';
import LoadReportsDialog from './LoadReportsDialog';
import { getCompetencyOptions, getStoreCategoryOptions } from '../utils/formatters';

const MAX_CHARS = 300;

const StoryForm = React.forwardRef(({ onSubmit, isLoading, onStoryChange, isDisabled = false, onReportLoaded }, ref) => {
  const formRef = useRef(null);
  const [story, setStory] = useState('');
  const [competency, setCompetency] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const charsLeft = MAX_CHARS - story.length;
  const isOverLimit = charsLeft < 0;
  
  // 載入報告對話框
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 獲取選項
  const competencyOptions = getCompetencyOptions(false); // 不包含空選項
  const storeCategoryOptions = getStoreCategoryOptions(false); // 不包含空選項
  
  // 暴露重置方法給外部
  React.useImperativeHandle(ref, () => ({
    resetForm: () => {
      setStory('');
      setCompetency('');
      setStoreCategory('');
      if (onStoryChange) {
        onStoryChange('');
      }
      // 如果有表單引用，重置 HTML 表單元素
      if (formRef.current) {
        formRef.current.reset();
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

  // 完全重置表單的函數 (內部使用)
  const resetFormInternal = () => {
    setStory('');
    setCompetency('');
    setStoreCategory('');
    if (onStoryChange) {
      onStoryChange('');
    }
    // 如果有表單引用，重置 HTML 表單元素
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // 清除按鈕處理函數
  const handleClear = () => {
    resetFormInternal();
  };

  // 確保提交表單時考慮禁用狀態
  const handleSubmit = (e) => {
    e.preventDefault();
    if (story.trim() && !isOverLimit && !isDisabled && !isLoading && competency && storeCategory) {
      onSubmit(story, competency, storeCategory);
    }
  };

  // 處理載入報告
  const handleReportSelected = (report) => {
    if (report && onReportLoaded) {
      onReportLoaded(report);
    }
  };

  const handleSampleStory = () => {
    // 創建多個範例故事模板
    const storyTemplates = [
      `在去年，我負責一個客戶滿意度下降的問題。經調查發現，客戶抱怨我們的回應速度太慢。身為客服團隊主管，我重新設計了流程，建立分類系統，並實施每週培訓。三個月後，我們的回應時間減少了40%，客戶滿意度提高了25%，投訴數量下降了30%。管理層認可這些改進，並在全公司推廣我們的方法。`,
      `在一個跨部門專案中，我們面臨著嚴重的時程延誤。作為專案經理，我首先分析了瓶頸，發現溝通不足是主要問題。我建立了每日15分鐘的站立會議，並導入了團隊協作工具。我還重新安排了任務優先順序，將專案分解為更小的里程碑。結果，我們不僅按時完成了專案，還比預算節省了12%的成本，客戶給予了極高的評價。`,
      `我們公司的網站流量持續下降，作為數位行銷專員，我被指派解決這個問題。我首先進行了全面的數據分析，發現SEO策略過時是主要原因。我重新優化了網站內容、改進了關鍵字策略，並實施了內容行銷計劃。經過兩個月的努力，網站流量增加了35%，轉換率提高了15%，這直接帶來了20%的收入增長。`,
      `在帶領一個新團隊時，我注意到團隊成員之間存在嚴重的協作問題。我首先進行了一對一面談，了解每個人的擔憂和建議。然後，我組織了團隊建設活動，明確了每個人的角色和責任，並建立了透明的績效評估系統。六個月後，團隊的協作能力大幅提升，項目完成速度加快了25%，員工滿意度從6.2分上升到8.7分。`,
      `在一次系統升級中，我們面臨資料遷移的重大風險。作為技術負責人，我制定了詳細的風險評估和應急計劃，設計了嚴格的測試流程，並建立了回滾機制。在實施過程中，我們確實遇到了幾個未預見的問題，但由於準備充分，我們能夠快速解決而不影響用戶。最終，遷移成功完成，停機時間比計劃縮短了40%，零資料損失。`
    ];
    
    // 隨機選擇一個故事模板
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
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      width="100%" // 確保始終佔滿容器寬度
      maxWidth={{ base: "100%", md: "container.md", lg: "container.lg" }} // 響應式最大寬度
    >
      <VStack spacing={4} align="stretch">
        {/* 載入報告按鈕 */}
<Flex justify="flex-end">
  <Button
    leftIcon={<FiDownload />}
    size="md" // 從 sm 改為 md，使按鈕更大
    variant="outline"
    colorScheme="teal"
    isDisabled={isLoading} // 移除 isDisabled 條件，使報告生成後按鈕也可用
    onClick={onOpen}
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
            isDisabled={isLoading || isDisabled}
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
            isDisabled={isLoading || isDisabled}
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
            輸入你的職場故事
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
            maxLength={MAX_CHARS + 10} // 允許稍微超過一點，但會顯示警告
            isDisabled={isLoading || isDisabled}
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <HStack spacing={2}>
            <Button
              leftIcon={<FiFileText />}
              variant="outline"
              onClick={handleSampleStory}
              size="md"
              isDisabled={isLoading || isDisabled}
            >
              產生隨機故事
            </Button>
            <Button
              leftIcon={<FiTrash2 />}
              variant="outline"
              onClick={handleClear}
              size="md"
              colorScheme="red"
              isDisabled={story.trim() === '' || isLoading || isDisabled}
            >
              清除內容
            </Button>
          </HStack>
<Button
  type="submit"
  leftIcon={<FiSend />}
  colorScheme="blue"
  isLoading={isLoading}
  loadingText="生成中..."
  isDisabled={story.trim() === '' || isOverLimit || isDisabled || !competency || !storeCategory}
  size="md" // 從 lg 改為 md，使按鈕與其他按鈕大小一致
>
  生成STAR報告
</Button>
        </Box>
      </VStack>

      {/* 載入報告對話框 */}
      <LoadReportsDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        onReportSelect={handleReportSelected} 
      />
    </Box>
  );
});

export default StoryForm;