import React, { useEffect, useMemo, useCallback, useId } from 'react';
import { Vitessce } from 'vitessce';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import VisualizationDownloadButton from 'js/components/detailPage/visualization/VisualizationDownloadButton';
import VisualizationWorkspaceButton from 'js/components/detailPage/visualization/VisualizationWorkspaceButton';
import VisualizationShareButton from 'js/components/detailPage/visualization/VisualizationShareButton';
import VisualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import VisualizationFooter from 'js/components/detailPage/visualization/VisualizationFooter';
import VisualizationTracker from 'js/components/detailPage/visualization/VisualizationTracker';

import { useCanvasScrollFix, useCollapseViz, useFirefoxWarning, useVitessceConfig } from './hooks';
import {
  ExpandButton,
  ExpandableDiv,
  SelectionButton,
  StyledDetailPageSection,
  StyledSectionHeader,
  bodyExpandedCSS,
  vitessceFixedHeight,
} from './style';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  fullscreenVizId: state.fullscreenVizId,
  expandViz: state.expandViz,
  collapseViz: state.collapseViz,
  vizTheme: state.vizTheme,
  setVitessceState: state.setVitessceState,
  setVizNotebookId: state.setVizNotebookId,
  setVitessceStateDebounced: state.setVitessceStateDebounced,
});

interface VisualizationProps {
  vitData: object | object[];
  uuid?: string;
  hasNotebook: boolean;
  shouldDisplayHeader: boolean;
  shouldMountVitessce?: boolean;
  markerGene?: string;
}

function Visualization({
  vitData,
  uuid,
  hasNotebook,
  shouldDisplayHeader,
  shouldMountVitessce = true,
  markerGene,
}: VisualizationProps) {
  const { fullscreenVizId, expandViz, vizTheme, setVitessceState, setVitessceStateDebounced, setVizNotebookId } =
    useVisualizationStore(visualizationStoreSelector);

  const id = useId();
  const vizIsFullscreen = fullscreenVizId === id;

  // Add event listeners to the document to handle the full screen mode.
  useCollapseViz();
  // Show a warning to Firefox users that Vitessce may be slower in Firefox.
  useFirefoxWarning();
  //
  useCanvasScrollFix();
  const { toastError, toastInfo } = useSnackbarActions();

  const handleWarning = useCallback(
    (message: string) => {
      // Suppress the "Node not found" and "Unexpected response status" messages related to zarr files
      if (message.includes('Node not found') || message.includes('Unexpected response status')) {
        return;
      }
      toastError(message);
    },
    [toastError],
  );

  const trackEntityPageEvent = useTrackEntityPageEvent();

  // Propagate UUID to the store if there is a notebook so we can display the download button when the visualization is expanded
  // Reruns every time vizIsFullscreen changes to ensure the proper notebook's UUID is used
  useEffect(() => {
    if (hasNotebook && uuid) {
      setVizNotebookId(uuid);
    }
  }, [hasNotebook, vizIsFullscreen, setVizNotebookId, uuid]);

  // Show instructions for exiting full screen mode when the user enters full screen mode.
  useEffect(() => {
    if (vizIsFullscreen) {
      toastInfo('Press [esc] to exit full window.');
    }
  }, [vizIsFullscreen, toastInfo]);

  // Get the vitessce configuration from the url if available and set the selection if it is a multi-dataset.
  const { vitessceConfig, vitessceSelection, setVitessceSelection } = useVitessceConfig({
    vitData,
    setVitessceState,
    markerGene,
  });

  function setSelectionAndClearErrors({ i }: { i: number }) {
    setVitessceSelection(i);
  }

  const isMultiDataset = Array.isArray(vitessceConfig);

  // Find parent UUID for the visualization if present
  const parentUuid: string | undefined = useMemo(() => {
    if (Array.isArray(vitData)) {
      const vitDataArray = vitData as object[];
      const found = vitDataArray.find((data) => 'parentUuid' in data) as { parentUuid: string } | undefined;
      return found?.parentUuid;
    }
    if ('parentUuid' in vitData) {
      return (vitData as { parentUuid: string }).parentUuid;
    }
    return undefined;
  }, [vitData]);

  if (!vitessceConfig) {
    return null;
  }

  return (
    // Don't render multi-datasets unless they have a selection from the list of options in vitessceConfig.
    (!isMultiDataset || Number.isInteger(vitessceSelection)) && (
      <StyledDetailPageSection id="visualization" $vizIsFullscreen={vizIsFullscreen}>
        <SpacedSectionButtonRow
          leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          buttons={
            <Stack direction="row" spacing={1}>
              {hasNotebook && <VisualizationWorkspaceButton />}
              <VisualizationDownloadButton uuid={uuid} hasNotebook={hasNotebook} parentUuid={parentUuid} />
              <VisualizationShareButton />
              <VisualizationThemeSwitch />
              <SecondaryBackgroundTooltip title="Switch to Fullscreen">
                <ExpandButton
                  size="small"
                  onClick={() => {
                    expandViz(id, true);
                    trackEntityPageEvent({ action: 'Vitessce / Full Screen' });
                  }}
                  variant="contained"
                >
                  <FullscreenRoundedIcon color="primary" />
                </ExpandButton>
              </SecondaryBackgroundTooltip>
              {isMultiDataset && vitessceSelection != null && (
                <DropdownListbox
                  buttonComponent={SelectionButton}
                  optionComponent={DropdownListboxOption}
                  selectedOptionIndex={vitessceSelection}
                  options={vitessceConfig as { name: string }[]}
                  selectOnClick={setSelectionAndClearErrors}
                  getOptionLabel={(v) => v.name}
                  buttonProps={{ color: 'primary' }}
                  id="visualization-data"
                />
              )}
            </Stack>
          }
        />
        <Paper>
          <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={vizTheme}>
            {shouldMountVitessce && (
              <VisualizationTracker>
                <Vitessce
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  config={isMultiDataset ? vitessceConfig[vitessceSelection!] : vitessceConfig}
                  theme={vizTheme}
                  onConfigChange={setVitessceStateDebounced}
                  height={vizIsFullscreen ? null : vitessceFixedHeight}
                  onWarn={handleWarning}
                />
              </VisualizationTracker>
            )}
          </ExpandableDiv>
        </Paper>
        <VisualizationFooter />
        <style type="text/css">{vizIsFullscreen && bodyExpandedCSS}</style>
      </StyledDetailPageSection>
    )
  );
}

export default Visualization;
