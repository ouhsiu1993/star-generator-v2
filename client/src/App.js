import React, { useState, useEffect, createContext } from 'react';
import { 
  Box, 
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

// 創建一個上下文來管理應用程式狀態
export const AppContext = createContext();

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  // 處理頁面離開前的確認
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasContent || isLoading) {
        const message = "離開後將無法找回內容，是否確認離開?";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasContent, isLoading]);
  
  // 處理用戶點擊後退按鈕
  useEffect(() => {
    const handlePopState = (e) => {
      if (hasContent || isLoading) {
        onOpen();
        // 防止默認後退行為
        window.history.pushState(null, null, window.location.pathname);
        e.preventDefault();
      }
    };
    
    // 添加一個歷史條目，這樣當用戶點擊後退時，我們可以捕獲它
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasContent, isLoading, onOpen]);
  
  // 確認離開
  const handleLeave = () => {
    setHasContent(false);
    setIsLoading(false);
    onClose();
    window.history.back();
  };
  
  return (
    <AppContext.Provider value={{ 
      hasContent, 
      setHasContent,
      isLoading,
      setIsLoading
    }}>
      <Box minH="100vh" bg={bgColor} display="flex" flexDirection="column">
        <Header />
        <Box as="main" maxW="container.xl" mx="auto" p={4} flex="1">
          <Home />
        </Box>
        <Footer />
      </Box>
      
      {/* 離開頁面確認對話框 */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              確認離開頁面
            </AlertDialogHeader>

            <AlertDialogBody>
              離開後將無法找回內容，是否確認離開?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button colorScheme="red" onClick={handleLeave} ml={3}>
                離開
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AppContext.Provider>
  );
}

export default App;