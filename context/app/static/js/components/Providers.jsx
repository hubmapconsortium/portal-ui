import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { faro } from '@grafana/faro-web-sdk';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';

import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import GlobalStyles from 'js/components/globalStyles';
import { ProtocolAPIContext } from 'js/components/detailPage/Protocol/ProtocolAPIContext';
import { EntityStoreProvider } from 'js/stores/useEntityStore';
import theme from '../theme';
import GlobalFonts from '../fonts';
import { useEntityHeaderSprings } from './detailPage/entityHeader/EntityHeader/hooks';

const swrConfig = {
  revalidateOnFocus: false,
  onError: (error, key) => {
    faro.api.pushError(error, {
      context: { key, type: 'SWR Error' },
    });
  },
  onLoadingSlow: (key) => {
    // By default, this is triggered if a request takes longer than 3000ms.
    faro.api.pushError(new Error(`Slow-loading query: ${key}`), {
      context: { key, type: 'SWR Slow Loading' },
    });
  },
};

export default function Providers({
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

  const { springs } = useEntityHeaderSprings();

  return (
    <SWRConfig value={swrConfig}>
      <GlobalFonts />
      <MuiThemeProvider theme={theme}>
        <SCThemeProvider theme={theme}>
          <AppContext.Provider value={appContext}>
            <FlaskDataContext.Provider value={flaskData}>
              <EntityStoreProvider springs={springs} assayMetadata={flaskData?.entity ?? {}}>
                <ProtocolAPIContext.Provider value={protocolsContext}>
                  <CssBaseline />
                  <GlobalStyles />
                  {children}
                </ProtocolAPIContext.Provider>
              </EntityStoreProvider>
            </FlaskDataContext.Provider>
          </AppContext.Provider>
        </SCThemeProvider>
      </MuiThemeProvider>
    </SWRConfig>
  );
}
