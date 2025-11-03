import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import { faro } from '@grafana/faro-web-sdk';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import GlobalStyles from 'js/components/globalStyles';
import { ProtocolAPIContext } from 'js/components/detailPage/Protocol/ProtocolAPIContext';
import { EntityStoreProvider } from 'js/stores/useEntityStore';
import { OpenKeyNavStoreProvider, readOpenKeyNavCookie } from 'js/stores/useOpenKeyNavStore';

import { InitialHashContextProvider } from 'js/hooks/useInitialHash';
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
  userFirstName,
  userLastName,
  userGlobusId,
  userGlobusAffiliation,
}) {
  const appContext = useMemo(
    () => ({
      groupsToken,
      workspacesToken,
      isWorkspacesUser,
      isHubmapUser,
      isAuthenticated,
      userEmail,
      userFirstName,
      userLastName,
      userGlobusId,
      userGlobusAffiliation,
      ...endpoints,
    }),
    [
      groupsToken,
      workspacesToken,
      isWorkspacesUser,
      isHubmapUser,
      isAuthenticated,
      userEmail,
      userFirstName,
      userLastName,
      userGlobusId,
      userGlobusAffiliation,
      endpoints,
    ],
  );

  const protocolsContext = useMemo(
    () => ({ clientId: flaskData?.protocolsClientId, clientAuthToken: flaskData?.protocolsClientToken }),
    [flaskData],
  );

  const flaskDataWithDefaults = useMemo(() => ({ entity: {}, ...flaskData }), [flaskData]);

  const { springs } = useEntityHeaderSprings();

  return (
    <SWRConfig value={swrConfig}>
      <InitialHashContextProvider>
        <GlobalFonts />
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={appContext}>
            <FlaskDataContext.Provider value={flaskDataWithDefaults}>
              <EntityStoreProvider springs={springs} assayMetadata={flaskData?.entity ?? {}}>
                <OpenKeyNavStoreProvider initialize={readOpenKeyNavCookie()}>
                  <ProtocolAPIContext.Provider value={protocolsContext}>
                    <CssBaseline />
                    <GlobalStyles />
                    {children}
                  </ProtocolAPIContext.Provider>
                </OpenKeyNavStoreProvider>
              </EntityStoreProvider>
            </FlaskDataContext.Provider>
          </AppContext.Provider>
        </ThemeProvider>
      </InitialHashContextProvider>
    </SWRConfig>
  );
}
