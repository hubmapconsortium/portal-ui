import React, { Suspense, lazy } from 'react';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';

import { useAppContext } from 'js/components/Contexts';
import { ExpandButton, ExpandableDiv } from 'js/components/detailPage/visualization/Visualization/style';
import BodyExpandedCSS from 'js/components/detailPage/visualization/BodyExpandedCSS';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import { SavedPreferences } from 'js/components/savedLists/types';

import HuBMAPPerson from 'assets/svg/hubmap-person.svg';
import SaySeePanelDescription from './SeeSayPanelDescription';
import SaySeeWelcomeDialog from './SaySeeWelcomeDialog';
import OpenInWorkspacesFromYAC from './OpenInWorkspacesFromYAC';
import useSaySeeDownloadActions from './saySeeDownloadActions';

import 'udi-yac/style.css';

import { DatasetIcon, DonorIcon, SampleIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';
import { useEventCallback } from '@mui/material/utils';

const UDIChat = lazy(() => import('udi-yac').then((m) => ({ default: m.UDIChat })));

export const SAY_SEE_VIZ_ID = 'search-say-see';
const DATA_PACKAGE_PATH = '/metadata/v0/udi/datapackage.json';
const API_BASE_URL = document.location.origin;
const FETCH_OPTIONS: RequestInit = { credentials: 'include' };
const NON_EXPANDED_HEIGHT = 700;

function visualizationSelector(store: VisualizationStore) {
  return {
    fullscreenVizId: store.fullscreenVizId,
    theme: store.vizTheme,
    expandViz: store.expandViz,
    collapseViz: store.collapseViz,
  };
}

function ChatFallback() {
  return <Skeleton variant="rectangular" width="100%" height={NON_EXPANDED_HEIGHT - 100} />;
}

function SaySeePanel() {
  const { isAuthenticated, isHubmapUser, isWorkspacesUser } = useAppContext();
  const { fullscreenVizId, theme, expandViz, collapseViz } = useVisualizationStore(visualizationSelector);
  const isFullscreen = fullscreenVizId === SAY_SEE_VIZ_ID;
  const { savedPreferences: rawPrefs, isLoading: prefsLoading } = useSavedPreferences();
  const savedPreferences = rawPrefs as SavedPreferences;
  const useAuthScope = isHubmapUser && savedPreferences?.saySeeDataScope === 'authenticated';
  const dataPackagePath = useAuthScope ? DATA_PACKAGE_PATH : `${DATA_PACKAGE_PATH}?public=1`;
  const downloadActions = useSaySeeDownloadActions();

  const toggleFullscreen = useEventCallback(() => {
    if (isFullscreen) {
      collapseViz();
    } else {
      expandViz(SAY_SEE_VIZ_ID);
    }
  });

  const onEvent = useEventCallback((name: string, properties?: Record<string, unknown>) => {
    const sessionId = properties?.sessionId as string | undefined;
    trackEvent({ name, ...properties }, sessionId);
  });

  return (
    <Stack direction="column" spacing={2}>
      <SaySeeWelcomeDialog />
      {isWorkspacesUser && <OpenInWorkspacesFromYAC />}
      <SaySeePanelDescription />
      <Stack direction="row" justifyContent="flex-end">
        <SecondaryBackgroundTooltip title={isFullscreen ? 'Exit Fullscreen' : 'Switch to Fullscreen'}>
          <ExpandButton
            size="small"
            onClick={toggleFullscreen}
            variant="contained"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FullscreenExitRoundedIcon color="primary" /> : <FullscreenRoundedIcon color="primary" />}
          </ExpandButton>
        </SecondaryBackgroundTooltip>
      </Stack>
      <Paper>
        <ExpandableDiv $isExpanded={isFullscreen} $theme={theme} $nonExpandedHeight={NON_EXPANDED_HEIGHT}>
          <Suspense fallback={<ChatFallback />}>
            {prefsLoading ? (
              <ChatFallback />
            ) : (
              <UDIChat
                key={dataPackagePath}
                apiBaseUrl={API_BASE_URL}
                dataPackagePath={dataPackagePath}
                fetchOptions={FETCH_OPTIONS}
                requireApiKey={!isAuthenticated}
                style={{ height: '100%', width: '100%' }}
                entityIcons={{
                  datasets: DatasetIcon,
                  samples: SampleIcon,
                  donors: DonorIcon,
                }}
                mascot={<HuBMAPPerson style={{ width: 300, height: 'auto' }} />}
                onEvent={onEvent}
                downloadActions={downloadActions}
              />
            )}
          </Suspense>
          <BodyExpandedCSS id={SAY_SEE_VIZ_ID} />
        </ExpandableDiv>
      </Paper>
    </Stack>
  );
}

export default SaySeePanel;
