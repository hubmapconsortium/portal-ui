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
          left: '20px',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          display: 'flex',
          'min-height': '100vh',
          'flex-direction': 'column',
        },
        li: {
          'list-style': 'none',
        },
        '#react-content': {
          display: 'flex',
          'min-height': '100vh',
          'flex-direction': 'column',
        },
        a: {
          'text-decoration': 'none',
          'background-color': 'transparent',
        },
        '.lu-wrapper': {
          height: `calc(100vh - ${headerHeight}px - 100px)`,
        },
      }}
    />
  );
}

export default MuiGlobalStyles;
