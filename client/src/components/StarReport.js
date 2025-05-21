import React, { useRef, useState, useContext } from 'react';
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
} from '@chakra-ui/react';
import { FiCopy, FiSave } from 'react-icons/fi';
import { AppContext } from '../App';

const StarReport = ({ report, onNewReport }) => {
  const reportRef = useRef(null);
  const cancelRef = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const toast = useToast();
  const { setHasContent } = useContext(AppContext);
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
    const reportText = `STAR 報告：
    
情境 (Situation):
${report.situation}

任務 (Task):
${report.task}

行動 (Action):
${report.action}

結果 (Result):
${report.result}`;

    navigator.clipboard.writeText(reportText);
    toast({
      title: "已複製",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // 儲存報告 (功能之後串接)
  const saveReport = () => {
    try {
      // 這裡之後會串接API儲存功能
      toast({
        title: "儲存成功",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "儲存失敗",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };
  
  // 返回頂部並重置
  const handleReturn = () => {
    setIsAlertOpen(false);
    setHasContent(false); // 重置全局內容狀態
    if (onNewReport) {
      onNewReport(); // 呼叫父組件提供的回調函數
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
        <Text fontSize="md">{content}</Text>
      </Box>
    </Box>
  );

  return (
    <Box
      ref={reportRef}
      bg={bgColor}
      borderRadius="lg"
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="md"
      position="relative"
      mt={6}
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading as="h3" size="lg" color={useColorModeValue("gray.700", "white")}>
            STAR 結構化報告
          </Heading>
          <HStack spacing={2}>
            <Tooltip hasArrow label="複製報告" placement="top">
              <IconButton
                icon={<FiCopy />}
                onClick={copyReport}
                aria-label="複製報告"
                variant="ghost"
              />
            </Tooltip>
            <Tooltip hasArrow label="儲存報告" placement="top">
              <IconButton
                icon={<FiSave />}
                onClick={saveReport}
                aria-label="儲存報告"
                variant="ghost"
              />
            </Tooltip>
          </HStack>
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
          >
            返回頂部創建新報告
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
          <AlertDialogContent>
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
    </Box>
  );
};

export default StarReport;