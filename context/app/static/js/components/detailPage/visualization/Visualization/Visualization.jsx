import Paper from '@mui/material/Paper';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import { isFirefox } from 'react-device-detect';
import React, { useEffect } from 'react';
import { Vitessce } from 'vitessce';

import packageInfo from 'package';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import VisualizationNotebookButton from '../VisualizationNotebookButton';
import VisualizationShareButton from '../VisualizationShareButton';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import VisualizationFooter from '../VisualizationFooter';
import VisualizationTracker from '../VisualizationTracker';

import { useVitessceConfig } from './hooks';
import {
  ExpandButton,
  ExpandableDiv,
  Flex,
  SelectionButton,
  StyledDetailPageSection,
  StyledSectionHeader,
  bodyExpandedCSS,
  vitessceFixedHeight,
} from './style';

const FIREFOX_WARNING = 'If the performance of Vitessce in Firefox is not satisfactory, please use Chrome or Safari.';
const localStorageFirefoxWarningKey = 'vitessce-firefox-warning';

const visualizationStoreSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
  expandViz: state.expandViz,
  collapseViz: state.collapseViz,
  vizTheme: state.vizTheme,
  setVitessceState: state.setVitessceState,
  setVizNotebookId: state.setVizNotebookId,
  setVitessceStateDebounced: state.setVitessceStateDebounced,
});

function Visualization({ vitData, uuid, hasNotebook, shouldDisplayHeader, shouldMountVitessce = true, markerGene }) {
  const {
    vizIsFullscreen,
    expandViz,
    collapseViz,
    vizTheme,
    setVitessceState,
    setVitessceStateDebounced,
    setVizNotebookId,
  } = useVisualizationStore(visualizationStoreSelector);

  const { toastError, toastInfo } = useSnackbarActions();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  // Propagate UUID to the store if there is a notebook so we can display the download button when the visualization is expanded
  // Reruns every time vizIsFullscreen changes to ensure the proper notebook's UUID is used
  useEffect(() => {
    if (hasNotebook) {
      setVizNotebookId(uuid);
    }
  }, [hasNotebook, vizIsFullscreen, setVizNotebookId, uuid]);

  // Show a warning if the user is using Firefox.
  useEffect(() => {
    if (isFirefox && !localStorage.getItem(localStorageFirefoxWarningKey)) {
      toastError(FIREFOX_WARNING);
      localStorage.setItem(localStorageFirefoxWarningKey, true);
    }
  }, [toastError]);

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

  function setSelectionAndClearErrors(itemAndIndex) {
    const { i } = itemAndIndex;
    setVitessceSelection(i);
  }

  useEffect(() => {
    function onKeydown(event) {
      if (event.key === 'Escape') {
        collapseViz();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [collapseViz]);

  const isMultiDataset = Array.isArray(vitessceConfig);
  const version = packageInfo.dependencies.vitessce.replace('^', '');

  if (!vitessceConfig) {
    return null;
  }

  const handleWarning = (message) => {
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
            <Flex>
              {hasNotebook && <VisualizationNotebookButton uuid={uuid} />}
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
              {isMultiDataset && (
                <DropdownListbox
                  buttonComponent={SelectionButton}
                  optionComponent={DropdownListboxOption}
                  selectedOptionIndex={vitessceSelection}
                  options={vitessceConfig}
                  selectOnClick={setSelectionAndClearErrors}
                  getOptionLabel={(v) => v.name}
                  buttonProps={{ color: 'primary' }}
                  id="visualization-data"
                />
              )}
            </Flex>
          }
        />
        <Paper>
          <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={vizTheme}>
            {shouldMountVitessce && (
              <VisualizationTracker>
                <Vitessce
                  config={vitessceConfig[vitessceSelection] || vitessceConfig}
                  theme={vizTheme}
                  onConfigChange={setVitessceStateDebounced}
                  height={vizIsFullscreen ? null : vitessceFixedHeight}
                  onWarn={handleWarning}
                />
              </VisualizationTracker>
            )}
          </ExpandableDiv>
        </Paper>
        <VisualizationFooter version={version} />
        <style type="text/css">{vizIsFullscreen && bodyExpandedCSS}</style>
      </StyledDetailPageSection>
    )
  );
}

export default Visualization;
