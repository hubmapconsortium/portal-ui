import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

function MuiGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        ':root': {
          '--header-height': '64px',
        },
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        li: {
          listStyle: 'none',
        },
        '#react-content': {
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
        },
        a: {
          textDecoration: 'none',
          backgroundColor: 'transparent',
        },
        '.lu-wrapper': {
          height: `calc(100vh - ${headerHeight}px - 100px)`,
        },
      }}
    />
  );
}

export default MuiGlobalStyles;
