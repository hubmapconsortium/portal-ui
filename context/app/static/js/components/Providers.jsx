import React, { useMemo } from 'react';
import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import { ThemeProvider, StyledEngineProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from 'js/components/globalStyles';
import theme from '../theme';
import GlobalFonts from '../fonts';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

function Providers({
  endpoints,
  groupsToken,
  isAuthenticated,
  userEmail,
  children,
  workspacesToken,
  isWorkspacesUser,
  isHubmapUser,
  flaskData,
}) {
  const appContext = useMemo(
    () => ({
      groupsToken,
      workspacesToken,
      isWorkspacesUser,
      isHubmapUser,
      isAuthenticated,
      userEmail,
      ...endpoints,
    }),
    [groupsToken, workspacesToken, isWorkspacesUser, isHubmapUser, isAuthenticated, userEmail, endpoints],
  );

  return (
    // injectFirst ensures styled-components takes priority over mui for styling
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <AppContext.Provider value={appContext}>
              <FlaskDataContext.Provider value={flaskData}>
                <CssBaseline />
                <GlobalStyles />
                {children}
              </FlaskDataContext.Provider>
            </AppContext.Provider>
          </ThemeProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export { AppContext };
export default Providers;
