import React from 'react';
import { Box, Heading, Flex, useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiStar, FiMoon, FiSun } from 'react-icons/fi';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="header" py={4} px={8} bg={bgColor} boxShadow="sm" borderBottomWidth="1px" borderColor={borderColor}>
      <Flex maxW="container.xl" mx="auto" justify="space-between" align="center">
        <Flex align="center">
          <FiStar size={24} color="#4299E1" />
          <Heading as="h1" size="lg" ml={2} color={useColorModeValue("gray.700", "white")}>
            GENSTAR
          </Heading>
        </Flex>
        <IconButton
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="solid"
          colorScheme={colorMode === 'light' ? 'purple' : 'yellow'}
          aria-label="切換暗/亮色模式"
          size="md"
          borderRadius="md"
        />
      </Flex>
    </Box>
  );
};

export default Header;