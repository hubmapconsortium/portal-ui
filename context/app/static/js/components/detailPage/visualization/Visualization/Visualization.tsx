import React, { useEffect, useCallback, useId } from 'react';
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
import { EventWithOptionalCategory } from 'js/components/types';

import BodyExpandedCSS from 'js/components/detailPage/visualization/BodyExpandedCSS';
import { useCanvasScrollFix, useCollapseViz, useFirefoxWarning, useVitessceConfig } from './hooks';
import { ExpandButton, ExpandableDiv, SelectionButton, StyledDetailPageSection, StyledSectionHeader } from './style';
import { vitessceFixedHeight } from '../style';
import VisualizationSkeleton from '../VitessceSkeleton/VisualizationSkeleton';

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
  vitData?: object | object[];
  trackingInfo: EventWithOptionalCategory;
  uuid?: string;
  hasNotebook: boolean;
  shouldDisplayHeader: boolean;
  shouldMountVitessce?: boolean;
  markerGene?: string;
  hideTheme?: boolean;
  hideShare?: boolean;
  title?: React.ReactNode;
}

function Visualization({
  vitData,
  trackingInfo,
  uuid,
  hasNotebook,
  shouldDisplayHeader,
  shouldMountVitessce = true,
  markerGene,
  hideTheme = false,
  hideShare = false,
  title = 'Visualization',
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
  const { vitessceConfig, vitessceSelection, setVitessceSelection, isMultiDataset, parentUuid, currentConfig } =
    useVitessceConfig({
      vitData,
      setVitessceState,
      markerGene,
    });

  const setSelectionAndClearErrors = useCallback(
    ({ i }: { i: number }) => {
      setVitessceSelection(i);
    },
    [setVitessceSelection],
  );

  const expandVisualization = useCallback(() => {
    expandViz(id);
    trackEntityPageEvent({ ...trackingInfo, action: `${trackingInfo.action} / Full Screen` });
  }, [expandViz, id, trackEntityPageEvent, trackingInfo]);

  if (!vitessceConfig) {
    return <VisualizationSkeleton />;
  }

  return (
    // Don't render multi-datasets unless they have a selection from the list of options in vitessceConfig.
    (!isMultiDataset || Number.isInteger(vitessceSelection)) && (
      <StyledDetailPageSection id="visualization" $vizIsFullscreen={vizIsFullscreen}>
        <SpacedSectionButtonRow
          leftText={shouldDisplayHeader ? <StyledSectionHeader>{title}</StyledSectionHeader> : undefined}
          buttons={
            <Stack direction="row" spacing={1}>
              {hasNotebook && <VisualizationWorkspaceButton />}
              <VisualizationDownloadButton uuid={uuid} hasNotebook={hasNotebook} parentUuid={parentUuid} />
              <VisualizationShareButton trackingInfo={trackingInfo} shouldDisplay={!hideShare} />
              <VisualizationThemeSwitch trackingInfo={trackingInfo} shouldDisplay={!hideTheme} />
              <SecondaryBackgroundTooltip title="Switch to Fullscreen">
                <ExpandButton size="small" onClick={expandVisualization} variant="contained">
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
                  config={currentConfig}
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
        <BodyExpandedCSS id={id} />
      </StyledDetailPageSection>
    )
  );
}

export default Visualization;
