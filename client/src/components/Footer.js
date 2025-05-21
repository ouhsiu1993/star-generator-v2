import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Link, useColorModeValue, HStack, Spinner } from '@chakra-ui/react';
import { FiGithub, FiDatabase, FiStar } from 'react-icons/fi';
import apiService from '../utils/apiService';

const Footer = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const currentYear = new Date().getFullYear();
  const [reportCount, setReportCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 獲取報告總數
  useEffect(() => {
    const fetchReportCount = async () => {
      setIsLoading(true);
      try {
        // 這裡使用 limit=1 只獲取一個結果，但我們主要是為了獲取總數
        const response = await apiService.getReports({ limit: 1 });
        if (response.success && response.pagination) {
          setReportCount(response.pagination.total);
        }
      } catch (error) {
        console.error('獲取報告數量失敗:', error);
        setReportCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportCount();
  }, []);
  
  return (
    <Box 
      as="footer" 
      py={6} 
      mt={12}
      bg={bgColor} 
      borderTopWidth="1px" 
      borderColor={borderColor}
    >
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        px={8}
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align="center"
        gap={4}
      >
        <HStack spacing={1}>
          <FiStar color="#4299E1" />
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            STAR 報告產生器 &copy; {currentYear}
          </Text>
        </HStack>
        
        <HStack spacing={6}>
          <Flex 
            align="center" 
            color={useColorModeValue("gray.600", "gray.400")}
            fontSize="sm"
          >
            <FiDatabase size={14} style={{ marginRight: '5px' }} />
            已儲存報告數: {isLoading ? <Spinner size="xs" ml={1} /> : reportCount !== null ? reportCount : '—'}
          </Flex>
          
          <Link 
            href="https://github.com"
            isExternal
            display="flex" 
            alignItems="center" 
            color={useColorModeValue("gray.600", "gray.400")}
            _hover={{ color: useColorModeValue("blue.500", "blue.300") }}
            fontSize="sm"
          >
            <FiGithub size={14} style={{ marginRight: '5px' }} />
            查看原始碼
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;