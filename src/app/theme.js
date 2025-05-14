'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Inter as interFont } from 'next/font/google';

const inter = interFont({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const baseTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 0,
          },
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 0,
          },
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            backgroundColor: 'var(--background-paper)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--secondary-main)',
            border: '2px solid var(--background-paper)',
            borderRadius: 8,
          },
          '--background-paper': '#F5EDE6',
          '--border-color': 'rgba(58, 28, 14, 0.23)',
          '--common-white': '#ffffff',
          '--secondary-main': '#D4A76A',
          '--text-primary': '#2A1509',
          '--text-secondary': '#5D3A2B',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-color)',
          },
          '& select:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
            WebkitTextFillColor: 'var(--text-primary)',
          },

          '& select:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
          },
          '& select:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
          },
          backgroundColor: 'var(--common-white)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'var(--border-color)',
            },
            backgroundColor: 'var(--common-white)',
            color: 'var(--text-primary)',
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
            WebkitTextFillColor: 'var(--text-primary)',
            borderRadius: 'inherit',
          },
          '& input:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
          },
          '& input:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px var(--common-white) inset',
          },
        },
      },
    },
  },
  cssVariables: true,
  palette: {
    accent: {
      contrastText: '#1a0e09',
      dark: '#3b1e12',
      light: '#6a3e23',
      main: '#512d1a',
    },
    background: {
      default: '#FFF9F5', // Soft cream
      paper: '#F5EDE6', // Light parchment
    },
    common: {
      black: '#1a0e09',
      white: '#ffffff',
    },
    error: {
      contrastText: '#ffffff',
      dark: '#a32929',
      light: '#f5bcbc',
      main: '#d94c4c',
    },
    mode: 'light',

    primary: {
      contrastText: '#FFFFFF',
      dark: '#261009',
      light: '#5D3A2B',
      main: '#3A1C0E', // Deep cocoa
    },
    secondary: {
      contrastText: '#1A0E09',
      dark: '#B78D56', // Gold accent
      light: '#E8C9A0',
      main: '#D4A76A',
    },
    success: {
      contrastText: '#000000',
      dark: '#6f9e40',
      light: '#c8e6c9',
      main: '#81c784',
    },

    text: {
      disabled: '#B7A99B', // Warm brown
      hint: '#B7A99B',
      primary: '#2A1509', // Deep brown
      secondary: '#5D3A2B', // Muted beige
    },
  },
  shadows: [
    'none',
    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    lineHeight: 1.5,
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
