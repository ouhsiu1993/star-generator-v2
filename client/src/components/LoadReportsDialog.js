import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  useColorModeValue,
  Spinner,
  Select,
  Flex,
  Divider,
  IconButton,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { FiSearch, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import apiService from '../utils/apiService';
import { formatDate, getCompetencyName, getStoreCategoryName, truncateText, getCompetencyOptions, getStoreCategoryOptions } from '../utils/formatters';

// 報告列表項目組件
const ReportItem = ({ report, onSelect, isSelected }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const hoverBgColor = useColorModeValue('blue.50', 'blue.900');
  const selectedBgColor = useColorModeValue('blue.100', 'blue.800');
  
  return (
    <Box
      p={3}
      borderRadius="md"
      bg={isSelected ? selectedBgColor : bgColor}
      _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
      onClick={() => onSelect(report)}
      borderWidth="1px"
      borderColor={isSelected ? 'blue.500' : 'transparent'}
      position="relative"
    >
      {isSelected && (
        <Box position="absolute" top="10px" right="10px">
          <Badge colorScheme="blue">已選擇</Badge>
        </Box>
      )}
      
      <VStack align="start" spacing={2}>
        <Flex width="100%" justify="space-between" wrap="wrap">
          <HStack spacing={2}>
            <Badge colorScheme="teal">{getCompetencyName(report.competency)}</Badge>
            <Badge colorScheme="purple">{getStoreCategoryName(report.storeCategory)}</Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">{formatDate(report.createdAt)}</Text>
        </Flex>
        
        <Text fontWeight="medium" noOfLines={1}>
          {truncateText(report.situation, 30)}
        </Text>
        
        <Text fontSize="sm" noOfLines={2} color="gray.500">
          {truncateText(report.task, 50)}
        </Text>
      </VStack>
    </Box>
  );
};

// 主對話框組件
const LoadReportsDialog = ({ isOpen, onClose, onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    competency: '',
    storeCategory: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const toast = useToast();
  
  // 獲取核心職能和商店類別選項
  const competencyOptions = getCompetencyOptions();
  const storeCategoryOptions = getStoreCategoryOptions();
  
  // 載入報告
  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await apiService.getReports({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setReports(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error('獲取報告失敗');
      }
    } catch (error) {
      console.error('載入報告錯誤:', error);
      toast({
        title: '載入報告失敗',
        description: error.message || '請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 當對話框開啟時，載入報告
  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen, filters, pagination.page]);
  
  // 處理過濾條件變更
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 重置分頁到第一頁
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // 處理報告選擇
  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };
  
  // 確認選擇並關閉對話框
  const handleConfirm = () => {
    if (selectedReport) {
      onReportSelect(selectedReport);
      onClose();
    } else {
      toast({
        title: '請選擇一個報告',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  // 切換到上一頁
  const goToPrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({
        ...prev,
        page: prev.page - 1
      }));
    }
  };
  
  // 切換到下一頁
  const goToNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };
  
  // 應用過濾條件
  const applyFilters = () => {
    loadReports();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>載入已儲存的報告</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {/* 過濾選項 */}
          <VStack spacing={4} align="stretch" mb={4}>
            <Flex gap={4} wrap="wrap">
              <Box flex="1" minW="200px">
                <Select
                  value={filters.competency}
                  onChange={(e) => handleFilterChange('competency', e.target.value)}
                  placeholder="選擇核心職能"
                >
                  {competencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </Box>
              
              <Box flex="1" minW="200px">
                <Select
                  value={filters.storeCategory}
                  onChange={(e) => handleFilterChange('storeCategory', e.target.value)}
                  placeholder="選擇商店類別"
                >
                  {storeCategoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </Box>
              
              <Button
                leftIcon={<FiSearch />}
                onClick={applyFilters}
                colorScheme="blue"
                isLoading={loading}
              >
                查詢
              </Button>
            </Flex>
          </VStack>
          
          <Divider mb={4} />
          
          {/* 報告列表 */}
          {loading ? (
            <Flex justify="center" align="center" py={10}>
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : reports.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py={10} textAlign="center">
              <Text fontSize="lg" fontWeight="medium" mb={2}>
                沒有找到報告
              </Text>
              <Text color="gray.500">
                嘗試調整過濾條件或建立新的報告
              </Text>
            </Flex>
          ) : (
            <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto" pr={2}>
              {reports.map(report => (
                <ReportItem
                  key={report._id}
                  report={report}
                  onSelect={handleReportSelect}
                  isSelected={selectedReport && selectedReport._id === report._id}
                />
              ))}
            </VStack>
          )}
          
          {/* 分頁控制 */}
          {!loading && reports.length > 0 && (
            <Flex justify="space-between" align="center" mt={4}>
              <Text fontSize="sm" color="gray.500">
                顯示 {reports.length} 個結果，共 {pagination.total} 個
              </Text>
              
              <HStack>
                <Tooltip label="上一頁" placement="top">
                  <IconButton
                    icon={<FiChevronLeft />}
                    onClick={goToPrevPage}
                    isDisabled={pagination.page <= 1}
                    size="sm"
                    variant="ghost"
                  />
                </Tooltip>
                
                <Text fontSize="sm">
                  {pagination.page} / {pagination.pages}
                </Text>
                
                <Tooltip label="下一頁" placement="top">
                  <IconButton
                    icon={<FiChevronRight />}
                    onClick={goToNextPage}
                    isDisabled={pagination.page >= pagination.pages}
                    size="sm"
                    variant="ghost"
                  />
                </Tooltip>
              </HStack>
            </Flex>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<FiCheck />}
            onClick={handleConfirm}
            isDisabled={!selectedReport}
          >
            套用選擇的報告
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoadReportsDialog;