'use client';

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
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
      contrastText: '#0d0d0d',
      dark: '#672f0a',
      light: '#a97b4c',
      main: '#903b0d',
    },
    background: { default: '#0d0d0d', paper: '#1a1a1a' },
    common: { black: '#000000', white: '#ffffff' },
    error: {
      contrastText: '#ffffff',
      dark: '#f1b0b7',
      light: '#f8d7da',
      main: '#f5c6cb',
    },
    mode: 'light',
    primary: {
      contrastText: '#ffffff',
      dark: '#4d2e07',
      light: '#a97b4c',
      main: '#944300',
    },
    secondary: {
      contrastText: '#ffffff',
      dark: '#4d2e07',
      light: '#903b0d',
      main: '#672f0a',
    },
    success: {
      contrastText: '#000000',
      dark: '#b1dfbb',
      light: '#d4edda',
      main: '#c3e6cb',
    },
    text: {
      disabled: 'rgba(255, 255, 255, 0.38)',
      hint: 'rgba(255, 255, 255, 0.38)',
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.54)',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
