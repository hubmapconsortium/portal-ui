import React, { PropsWithChildren, useMemo } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { trackEvent } from 'js/helpers/trackers';

import { FlaskDataContext, AppContext } from 'js/components/Contexts';
import type { AppContextType, FlaskDataContextType } from 'js/components/Contexts';
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
  onError: (error: Error, key: string) => {
    trackEvent({ category: 'SWR', action: 'Error', label: key, error: error.message });
  },
  // Triggered by default when a request takes longer than 3000ms.
  onLoadingSlow: (key: string) => {
    trackEvent({ category: 'SWR', action: 'Slow Loading', label: key });
  },
};

interface ProvidersProps {
  endpoints: Record<string, string>;
  groupsToken?: string;
  isAuthenticated?: boolean;
  userEmail?: string;
  workspacesToken?: string;
  isWorkspacesUser?: boolean;
  isHubmapUser?: boolean;
  flaskData: FlaskData;
  userFirstName?: string;
  userLastName?: string;
  userGlobusId?: string;
  userGlobusAffiliation?: string;
}

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
}: PropsWithChildren<ProvidersProps>) {
  const appContext = useMemo(
    () =>
      ({
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
      }) as AppContextType,
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
    () => ({
      clientId: flaskData?.protocolsClientId ?? '',
      clientAuthToken: flaskData?.protocolsClientToken ?? '',
    }),
    [flaskData],
  );

  const flaskDataWithDefaults = useMemo(
    () => ({ entity: {}, ...flaskData }) as unknown as FlaskDataContextType,
    [flaskData],
  );

  const { springs } = useEntityHeaderSprings();

  return (
    <NuqsAdapter>
      <SWRConfig value={swrConfig}>
        <InitialHashContextProvider>
          <GlobalFonts />
          <ThemeProvider theme={theme}>
            <AppContext.Provider value={appContext}>
              <FlaskDataContext.Provider value={flaskDataWithDefaults}>
                <EntityStoreProvider springs={springs}>
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
    </NuqsAdapter>
  );
}
