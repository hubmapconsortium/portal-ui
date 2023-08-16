import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import { captureException } from '@sentry/react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import { StylesProvider as MuiStylesProvider } from '@mui/styles';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import CssBaseline from '@mui/material/CssBaseline';

import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import GlobalStyles from 'js/components/globalStyles';
import { ProtocolAPIContext } from 'js/components/detailPage/Protocol/ProtocolAPIContext';
import theme from '../theme';
import GlobalFonts from '../fonts';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

const swrConfig = {
  revalidateOnFocus: false,
  onError: (error) => {
    captureException(error);
  },
};

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

  const protocolsContext = useMemo(
    () => ({ clientId: flaskData?.protocolsClientId, clientAuthToken: flaskData?.protocolsClientToken }),
    [flaskData],
  );

  return (
    // injectFirst ensures styled-components takes priority over mui for styling
    <SWRConfig value={swrConfig}>
      <MuiStylesProvider generateClassName={generateClassName} injectFirst>
        <GlobalFonts />
        <MuiThemeProvider theme={theme}>
          <SCThemeProvider theme={theme}>
            <AppContext.Provider value={appContext}>
              <FlaskDataContext.Provider value={flaskData}>
                <ProtocolAPIContext.Provider value={protocolsContext}>
                  <CssBaseline />
                  <GlobalStyles />
                  {children}
                </ProtocolAPIContext.Provider>
              </FlaskDataContext.Provider>
            </AppContext.Provider>
          </SCThemeProvider>
        </MuiThemeProvider>
      </MuiStylesProvider>
    </SWRConfig>
  );
}

export default Providers;
