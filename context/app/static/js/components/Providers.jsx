import React from 'react';
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

const AppContext = React.createContext({});

function Providers({ endpoints, groupsToken, isAuthenticated, userEmail, children, workspacesToken }) {
  // TODO: Delete this when workspaces are publicly released.
  // If we stay in limbo for a long time, this configuration could be moved out of code.
  const workspacesUsers = [
    'chuck_mccallum@hms.harvard.edu',
    'john_conroy@hms.harvard.edu',
    'pdblood@andrew.cmu.edu',
    'blood@psc.edu',
    'jpuerto@andrew.cmu.edu',
  ];
  // injectFirst ensures styled-components takes priority over mui for styling
  return (
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppContext.Provider
            value={{ groupsToken, workspacesToken, workspacesUsers, isAuthenticated, userEmail, ...endpoints }}
          >
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
