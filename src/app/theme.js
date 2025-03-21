'use client';

import { createTheme } from '@mui/material/styles';
import { Open_Sans as openSansFont } from 'next/font/google';

const openSans = openSansFont({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const theme = createTheme({
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
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
      default: '#ffffff',
      paper: '#f2f2f2',
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
      contrastText: '#ffffff',
      dark: '#120a06',
      light: '#4e342e',
      main: '#1c0f0a',
    },
    secondary: {
      contrastText: '#ffffff',
      dark: '#2b160b',
      light: '#875a3a',
      main: '#603921',
    },
    success: {
      contrastText: '#000000',
      dark: '#6f9e40',
      light: '#c8e6c9',
      main: '#81c784',
    },
    text: {
      disabled: 'rgba(0, 0, 0, 0.4)',
      hint: 'rgba(0, 0, 0, 0.5)',
      primary: '#1a0e09',
      secondary: '#603921',
    },
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
  },
});

export default theme;
