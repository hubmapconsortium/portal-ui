import React from 'react';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { MuiThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../theme';
import GlobalFonts from '../fonts';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

function Providers(props) {
  const { children } = props;
  // injectFirst ensures styled-components takes priority over mui for styling
  return (
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <GlobalFonts />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export default Providers;
