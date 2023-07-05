import React, { useMemo } from 'react';
import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { MuiThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
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
  flaskData,
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
    [groupsToken, workspacesToken, isWorkspacesUser, isAuthenticated, userEmail, endpoints],
  );

  return (
    // injectFirst ensures styled-components takes priority over mui for styling
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
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
    </StylesProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export { AppContext };
export default Providers;
