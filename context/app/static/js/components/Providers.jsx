import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from 'js/components/globalStyles';

import PropTypes from 'prop-types';
import { MuiThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../theme';
import GlobalFonts from '../fonts';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

const AppContext = React.createContext({});

function Providers(props) {
  const { endpoints, children } = props;
  // injectFirst ensures styled-components takes priority over mui for styling
  return (
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          {/* eslint-disable-next-line no-undef */}
          <AppContext.Provider value={{ nexusToken: nexus_token, ...endpoints }}>
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
