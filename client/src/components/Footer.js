import React from 'react';
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const currentYear = new Date().getFullYear();
  
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
        justify="center" // 將內容置中
        align="center"
      >
        <Text 
          fontSize="sm" 
          color={useColorModeValue("gray.600", "gray.400")}
        >
          ZanvoAI &copy; {currentYear}. All Rights Reserved
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;