import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Noto Sans TC', sans-serif",
    body: "'Noto Sans TC', sans-serif",
  },
  colors: {
    primary: {
      50: '#e6f2ff',
      100: '#bddeff',
      200: '#94caff',
      300: '#6bb6ff',
      400: '#42a2ff',
      500: '#298efc',
      600: '#1e6fc5',
      700: '#15518f',
      800: '#0b3359',
      900: '#021624',
    },
    secondary: {
      50: '#f0f9e8',
      100: '#d8ecc6',
      200: '#c0dfa3',
      300: '#a7d27f',
      400: '#8fc55c',
      500: '#76ab42',
      600: '#5c8634',
      700: '#426025',
      800: '#293917',
      900: '#101605',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
        },
        outline: {
          borderColor: 'primary.500',
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '600',
        color: 'gray.700',
      },
    },
  },
});

export default theme;