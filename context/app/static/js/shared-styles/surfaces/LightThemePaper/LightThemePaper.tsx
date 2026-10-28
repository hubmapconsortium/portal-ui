import React, { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';

import lightTheme from 'js/theme/theme';

/**
 * A Paper that keeps the light theme in dark mode, for third-party widgets that only have a light mode.
 */
function LightThemePaper({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Paper sx={{ colorScheme: 'light' }}>{children}</Paper>
    </ThemeProvider>
  );
}

export default LightThemePaper;
