import React, { useState, useEffect, useRef } from 'react';
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
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiSearch, FiCheck, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import apiService from '../utils/apiService';
import { formatDate, getCompetencyName, getStoreCategoryName, truncateText, getCompetencyOptions, getStoreCategoryOptions } from '../utils/formatters';

// 報告列表項目組件
const ReportItem = ({ report, onSelect, onDelete, isSelected }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const hoverBgColor = useColorModeValue('blue.50', 'blue.900');
  const selectedBgColor = useColorModeValue('blue.100', 'blue.800');
  
  // 防止刪除按鈕點擊事件傳播到父元素
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(report);
    }
  };
  
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
      <VStack align="start" spacing={2}>
        <Flex width="100%" justify="space-between" wrap="wrap">
          <HStack spacing={2}>
            <Badge colorScheme="teal">{getCompetencyName(report.competency)}</Badge>
            <Badge colorScheme="purple">{getStoreCategoryName(report.storeCategory)}</Badge>
          </HStack>
          <HStack>
            <Text fontSize="xs" color="gray.500">{formatDate(report.createdAt)}</Text>
            <Tooltip label="刪除報告" placement="top">
              <IconButton
                icon={<FiTrash2 />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={handleDeleteClick}
                aria-label="刪除報告"
              />
            </Tooltip>
          </HStack>
        </Flex>
        
        <Text fontWeight="medium" noOfLines={1}>
          {report.name || '未命名報告'}
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
    name: '' // 新增報告名稱過濾
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const toast = useToast();
  
  // 刪除確認對話框
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const cancelRef = useRef();
  
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
  
  // 處理刪除報告點擊
  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setIsDeleteAlertOpen(true);
  };
  
  // 確認刪除報告
  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      const response = await apiService.deleteReport(reportToDelete._id);
      
      if (response.success) {
        // 如果刪除的報告是當前選中的，則取消選擇
        if (selectedReport && selectedReport._id === reportToDelete._id) {
          setSelectedReport(null);
        }
        
        // 重新載入報告列表
        loadReports();
        
        toast({
          title: '刪除成功',
          description: '報告已成功刪除',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(response.error || '刪除失敗');
      }
    } catch (error) {
      console.error('刪除報告錯誤:', error);
      toast({
        title: '刪除失敗',
        description: error.message || '請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setReportToDelete(null);
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

  // 處理名稱輸入變化
  const handleNameInputChange = (e) => {
    handleFilterChange('name', e.target.value);
  };
  
  // 處理按下 Enter 鍵
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>載入已儲存的報告</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {/* 搜尋欄位 */}
            <VStack spacing={4} align="stretch" mb={4}>
              {/* 新增報告名稱搜尋欄位 */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="搜尋報告名稱" 
                  value={filters.name}
                  onChange={handleNameInputChange}
                  onKeyDown={handleKeyDown}
                />
              </InputGroup>
              
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
                    onDelete={handleDeleteClick}
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
      
      {/* 刪除確認對話框 */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              刪除報告
            </AlertDialogHeader>

            <AlertDialogBody>
              確定要刪除報告 "{reportToDelete?.name || '未命名報告'}" 嗎？此操作無法撤銷。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                取消
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                刪除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LoadReportsDialog;