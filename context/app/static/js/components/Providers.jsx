import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider, StylesProvider, createGenerateClassName } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import GlobalStyles from 'js/components/globalStyles';
import theme from '../theme';
import GlobalFonts from '../fonts';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

const AppContext = React.createContext({});

function Providers({
  endpoints,
  groupsToken,
  isAuthenticated,
  userEmail,
  children,
  workspacesToken,
  isWorkspacesUser,
}) {
  const appContext = useMemo(
    () => ({
      groupsToken,
      workspacesToken,
      isWorkspacesUser,
      isAuthenticated,
      userEmail,
      ...endpoints,
    }),
    [endpoints, groupsToken, isAuthenticated, isWorkspacesUser, userEmail, workspacesToken],
  );
  return (
    // injectFirst ensures styled-components takes priority over mui for styling
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={appContext}>
            <CssBaseline />
            <GlobalStyles />
            {children}
          </AppContext.Provider>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export { AppContext };
export default Providers;
