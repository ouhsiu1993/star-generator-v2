import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useToast,
  Stack
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import apiService from '../utils/apiService';

const SaveReportDialog = ({ isOpen, onClose, report, onSaveSuccess }) => {
  const [reportName, setReportName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const initialRef = useRef();
  const toast = useToast();

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportName.trim()) {
      toast({
        title: "請輸入報告名稱",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // 建立報告數據，加入名稱
      const reportData = {
        name: reportName.trim(),
        situation: report.situation,
        task: report.task,
        action: report.action,
        result: report.result,
        competency: report.competency,
        storeCategory: report.storeCategory,
        originalStory: report.originalStory || ''
      };
      
      // 呼叫 API 儲存
      const response = await apiService.saveReport(reportData);
      
      if (response.success) {
        toast({
          title: "儲存成功",
          description: "報告已成功儲存到數據庫",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        // 關閉對話框並通知父組件
        onClose();
        if (onSaveSuccess) {
          onSaveSuccess(response.data.id);
        }
      } else {
        throw new Error(response.error || '儲存失敗');
      }
    } catch (error) {
      console.error('儲存報告錯誤:', error);
      toast({
        title: "儲存失敗",
        description: error.message || "請稍後再試",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 當對話框關閉時重置表單
  const handleClose = () => {
    setReportName('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      initialFocusRef={initialRef}
      size={{ base: 'sm', md: 'md' }}
    >
      <ModalOverlay />
      <ModalContent 
        as="form" 
        onSubmit={handleSubmit}
        mx={{ base: 4, md: 'auto' }}
      >
        <ModalHeader>儲存報告</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>報告名稱</FormLabel>
            <Input 
              ref={initialRef}
              placeholder="輸入報告名稱"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
            <FormHelperText>
              為您的報告取一個有意義的名稱，便於日後查找
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter flexDirection={{ base: 'column', sm: 'row' }} gap={{ base: 2, sm: 0 }}>
          <Button 
            mr={{ base: 0, sm: 3 }} 
            onClick={handleClose}
            width={{ base: '100%', sm: 'auto' }}
            mb={{ base: 2, sm: 0 }}
          >
            取消
          </Button>
          <Button 
            colorScheme="blue" 
            type="submit"
            leftIcon={<FiSave />}
            isLoading={isSaving}
            loadingText="儲存中..."
            width={{ base: '100%', sm: 'auto' }}
          >
            儲存報告
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveReportDialog;