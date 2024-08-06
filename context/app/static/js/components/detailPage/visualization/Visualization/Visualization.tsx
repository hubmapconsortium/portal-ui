import Paper from '@mui/material/Paper';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';

import React, { useEffect } from 'react';
import { Vitessce } from 'vitessce';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useAppContext } from 'js/components/Contexts';

import Stack from '@mui/material/Stack';
import VisualizationNotebookButton from '../VisualizationNotebookButton';
import VisualizationShareButton from '../VisualizationShareButton';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import VisualizationFooter from '../VisualizationFooter';
import VisualizationTracker from '../VisualizationTracker';

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
  vizIsFullscreen: state.vizIsFullscreen,
  expandViz: state.expandViz,
  collapseViz: state.collapseViz,
  vizTheme: state.vizTheme,
  setVitessceState: state.setVitessceState,
  setVizNotebookId: state.setVizNotebookId,
  setVitessceStateDebounced: state.setVitessceStateDebounced,
});

interface VisualizationProps {
  vitData: object | object[];
  uuid: string;
  hubmap_id?: string;
  mapped_data_access_level?: string;
  hasNotebook: boolean;
  shouldDisplayHeader: boolean;
  shouldMountVitessce?: boolean;
  markerGene?: string;
}

function Visualization({
  vitData,
  uuid,
  hubmap_id,
  mapped_data_access_level,
  hasNotebook,
  shouldDisplayHeader,
  shouldMountVitessce = true,
  markerGene,
}: VisualizationProps) {
  const { vizIsFullscreen, expandViz, vizTheme, setVitessceState, setVitessceStateDebounced, setVizNotebookId } =
    useVisualizationStore(visualizationStoreSelector);

  // Add event listeners to the document to handle the full screen mode.
  useCollapseViz();
  // Show a warning to Firefox users that Vitessce may be slower in Firefox.
  useFirefoxWarning();
  //
  useCanvasScrollFix();
  const { toastError, toastInfo } = useSnackbarActions();
  const { isWorkspacesUser } = useAppContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  // Propagate UUID to the store if there is a notebook so we can display the download button when the visualization is expanded
  // Reruns every time vizIsFullscreen changes to ensure the proper notebook's UUID is used
  useEffect(() => {
    if (hasNotebook) {
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

  if (!vitessceConfig) {
    return null;
  }

  const handleWarning = (message: string) => {
    // Suppress the "Node not found" message that appears when no zarr file was found
    if (message.includes('Node not found')) {
      return;
    }
    toastError(message);
  };

  return (
    // Don't render multi-datasets unless they have a selection from the list of options in vitessceConfig.
    (!isMultiDataset || Number.isInteger(vitessceSelection)) && (
      <StyledDetailPageSection id="visualization" $vizIsFullscreen={vizIsFullscreen}>
        <SpacedSectionButtonRow
          leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          buttons={
            <Stack direction="row">
              {isWorkspacesUser && hasNotebook && (
                <VisualizationNotebookButton
                  uuid={uuid}
                  hubmap_id={hubmap_id}
                  mapped_data_access_level={mapped_data_access_level}
                />
              )}
              <VisualizationShareButton />
              <VisualizationThemeSwitch />
              <SecondaryBackgroundTooltip title="Switch to Fullscreen">
                <ExpandButton
                  size="small"
                  onClick={() => {
                    expandViz();
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
