import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Flex,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { FiCopy, FiSave, FiCheck } from 'react-icons/fi';
import { AppContext } from '../App';
import SaveReportDialog from './SaveReportDialog';
import { formatReportText } from '../utils/formatters';

const StarReport = ({ report, onNewReport }) => {
  const reportRef = useRef(null);
  const cancelRef = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const toast = useToast();
  const { setHasContent } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColors = {
    situation: useColorModeValue('blue.500', 'blue.300'),
    task: useColorModeValue('green.500', 'green.300'),
    action: useColorModeValue('orange.500', 'orange.300'),
    result: useColorModeValue('purple.500', 'purple.300'),
  };

  // 複製報告內容
  const copyReport = () => {
    const reportText = formatReportText(report);
    navigator.clipboard.writeText(reportText);
    
    toast({
      title: "已複製",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // 打開儲存報告對話框
  const handleSaveClick = () => {
    // 移除條件檢查，讓使用者可以隨時打開保存對話框
    onOpen();
  };
  
  // 儲存成功的回調 - 修改為顯示短暫的打勾後恢復
  const handleSaveSuccess = () => {
    // 設置為已保存狀態
    setIsSaved(true);
    
    // 2秒後恢復為未保存狀態
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };
  
  // 返回頂部並重置
  const handleReturn = () => {
    setIsAlertOpen(false);
    setHasContent(false); // 重置全局內容狀態
    if (onNewReport) {
      onNewReport(); // 呼叫父組件提供的回調函數，這將隱藏整個報告區塊
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 報告區段組件
  const ReportSection = ({ title, content, color, badge }) => (
    <Box w="100%">
      <HStack mb={2}>
        <Badge px={2} py={1} borderRadius="md" colorScheme={badge} fontSize="sm">
          {title}
        </Badge>
      </HStack>
      <Box
        p={4}
        borderLeft="4px solid"
        borderColor={color}
        bg={useColorModeValue(`${badge}.50`, `${badge}.900`)}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize={{ base: 'sm', md: 'md' }}>{content}</Text>
      </Box>
    </Box>
  );

  return (
    <Box
      ref={reportRef}
      bg={bgColor}
      borderRadius="lg"
      p={{ base: 4, md: 6 }}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="md"
      position="relative"
      mt={6}
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Flex 
          justify={{ base: 'space-between', md: 'space-between' }} 
          align="center"
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 2, sm: 0 }}
        >
          <Heading 
            as="h3" 
            size={{ base: 'md', md: 'lg' }} 
            color={useColorModeValue("gray.700", "white")}
            mb={{ base: 2, sm: 0 }}
          >
            STAR 報告
          </Heading>
          <Stack 
            direction="row" 
            spacing={2}
            justify={{ base: 'center', sm: 'flex-end' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            <Tooltip hasArrow label="複製報告" placement="top">
              <IconButton
                icon={<FiCopy />}
                onClick={copyReport}
                aria-label="複製報告"
                variant="ghost"
              />
            </Tooltip>
            <Tooltip hasArrow label={isSaved ? "已儲存" : "儲存報告"} placement="top">
              <IconButton
                icon={isSaved ? <FiCheck /> : <FiSave />}
                onClick={handleSaveClick}
                aria-label="儲存報告"
                variant="ghost"
                colorScheme={isSaved ? "green" : "blue"}
              />
            </Tooltip>
          </Stack>
        </Flex>

        <Divider />

        <ReportSection 
          title="情境 (Situation)" 
          content={report.situation} 
          color={accentColors.situation}
          badge="blue"
        />
        
        <ReportSection 
          title="任務 (Task)" 
          content={report.task} 
          color={accentColors.task}
          badge="green"
        />
        
        <ReportSection 
          title="行動 (Action)" 
          content={report.action} 
          color={accentColors.action}
          badge="orange"
        />
        
        <ReportSection 
          title="結果 (Result)" 
          content={report.result} 
          color={accentColors.result}
          badge="purple"
        />

        <Divider mt={2} />

        <Box textAlign="center">
          <Button
            onClick={() => setIsAlertOpen(true)}
            size="md"
            variant="outline"
            mt={2}
            width={{ base: '100%', sm: 'auto' }}
          >
            創建新報告
          </Button>
        </Box>
      </VStack>

      {/* 確認對話框 */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={{ base: 4, md: 0 }}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              創建新報告
            </AlertDialogHeader>

            <AlertDialogBody>
              離開後將無法找回內容，請確認已儲存。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                取消
              </Button>
              <Button colorScheme="blue" onClick={handleReturn} ml={3}>
                創建
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* 儲存報告對話框 */}
      <SaveReportDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        report={report}
        onSaveSuccess={handleSaveSuccess}
      />
    </Box>
  );
};

export default StarReport;