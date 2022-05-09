import React from 'react';
import { ThemeProvider } from 'styled-components';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

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

const instance = createInstance({
  urlBase: 'https://hubmapconsortium.matomo.cloud/',
  siteId: 1,
  // userId: 'UID76903202', // optional, default value: `undefined`.
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  // srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
  // disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  // heartBeat: { // optional, enabled by default
  //   active: true, // optional, default value: true
  //   seconds: 10 // optional, default value: `15
  // },
  // linkTracking: false, // optional, default value: true
  // configurations: { // optional, default value: {}
  //   // any valid matomo configuration, all below are optional
  //   disableCookies: true,
  //   setSecureCookie: true,
  //   setRequestMethod: 'POST'
  // }
});

const AppContext = React.createContext({});

function Providers(props) {
  const { endpoints, groupsToken, children } = props;
  // injectFirst ensures styled-components takes priority over mui for styling
  return (
    <MatomoProvider value={instance}>
      <StylesProvider generateClassName={generateClassName} injectFirst>
        <GlobalFonts />
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ groupsToken, ...endpoints }}>
              <CssBaseline />
              <GlobalStyles />
              {children}
            </AppContext.Provider>
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </MatomoProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
};

export { AppContext };
export default Providers;
