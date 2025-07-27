// sorteador-online/src/theme/theme.js
import React from 'react';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1D4ED8' }, // Azul MUI
    secondary: { main: '#2563EB' },
    background: { default: '#F3F4F6' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: { borderRadius: 16 },
});

theme = responsiveFontSizes(theme);
export default theme;