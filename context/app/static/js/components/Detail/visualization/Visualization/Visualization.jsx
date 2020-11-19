import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Vitessce, decodeURLParamsToConf } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMapRounded';
import debounce from 'lodash/debounce';

import { Alert } from 'js/shared-styles/alerts';
import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import VisualizationShareButton from '../VisualizationShareButton';
import {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  ExpandButton,
  VitessceInfoSnackbar,
  ErrorSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

const visualizationStoreSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
  expandViz: state.expandViz,
  collapseViz: state.collapseViz,
  vizTheme: state.vizTheme,
  vizEscSnackbarIsOpen: state.vizEscSnackbarIsOpen,
  setVizEscSnackbarIsOpen: state.setVizEscSnackbarIsOpen,
  vitessceConfig: state.vitessceConfig,
  setVitessceConfig: state.setVitessceConfig,
  onCopyUrlWarning: state.onCopyUrlWarning,
  onCopyUrlSnackbarOpen: state.onCopyUrlSnackbarOpen,
  setOnCopyUrlSnackbarOpen: state.setOnCopyUrlSnackbarOpen,
});

function Visualization(props) {
  const { vitData } = props;

  const {
    vizIsFullscreen,
    expandViz,
    collapseViz,
    vizTheme,
    vizEscSnackbarIsOpen,
    setVizEscSnackbarIsOpen,
    setVitessceConfig,
    onCopyUrlWarning,
    onCopyUrlSnackbarOpen,
    setOnCopyUrlSnackbarOpen,
  } = useVisualizationStore(visualizationStoreSelector);

  // Get the vitessce configuration from the url if available and set the initial selection if it is a multi-dataset.
  const [initializedVitData, initialSelection] = useMemo(() => {
    const queryString = window.location.href.split('#')[1];
    const vitessceURLConf = queryString?.length > 0 ? decodeURLParamsToConf(queryString) : null;
    const initialSelectionFromUrl =
      Array.isArray(vitData) && Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
    let initializedVitDataFromUrl = vitData;
    if (Array.isArray(vitData)) {
      initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
    } else {
      initializedVitDataFromUrl = vitessceURLConf || vitData;
    }
    setVitessceConfig(initializedVitDataFromUrl);
    return [initializedVitDataFromUrl, initialSelectionFromUrl];
  }, [vitData, setVitessceConfig]);

  const [vitessceErrors, setVitessceErrors] = useState([]);
  const [vitessceSelection, setVitessceSelection] = useState(initialSelection);
  const handleVitessceConfigDebounced = useCallback(debounce(setVitessceConfig, 250, { trailing: true }), [
    setVitessceConfig,
  ]);
  function removeError(message) {
    setVitessceErrors((prev) => prev.filter((d) => d !== message));
  }

  function addError(message) {
    setVitessceErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
  }

  function setSelectionAndClearErrors(itemAndIndex) {
    const { i } = itemAndIndex;
    setVitessceErrors([]);
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

  return (
    <StyledSectionContainer id="visualization">
      <StyledHeader>
        <StyledHeaderText>Visualization</StyledHeaderText>
        <StyledHeaderRight>
          <VisualizationShareButton />
          <VisualizationThemeSwitch />
          <SecondaryBackgroundTooltip title="Switch to Fullscreen">
            <ExpandButton size="small" onClick={expandViz} variant="contained">
              <ZoomOutMapIcon color="primary" />
            </ExpandButton>
          </SecondaryBackgroundTooltip>
          {Array.isArray(initializedVitData) ? (
            <DropdownListbox
              buttonComponent={SelectionButton}
              optionComponent={DropdownListboxOption}
              selectedOptionIndex={vitessceSelection}
              options={initializedVitData}
              selectOnClick={setSelectionAndClearErrors}
              getOptionLabel={(v) => v.name}
              id="visualization-data"
            />
          ) : null}
        </StyledHeaderRight>
      </StyledHeader>
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={vizTheme}>
          <VitessceInfoSnackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={vizEscSnackbarIsOpen}
            autoHideDuration={4000}
            onClose={() => setVizEscSnackbarIsOpen(false)}
            message="Press [esc] to exit full window."
          />
          <VitessceInfoSnackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={onCopyUrlSnackbarOpen}
            autoHideDuration={4000}
            $isWarning={onCopyUrlWarning}
            onClose={() => setOnCopyUrlSnackbarOpen(false)}
            message={`Shareable URL has been copied to clipboard. ${onCopyUrlWarning}`}
          />
          {vitessceErrors.length > 0 && (
            <ErrorSnackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open
              key={vitessceErrors[0]}
            >
              <Alert severity="error" onClose={() => removeError(vitessceErrors[0])}>
                {vitessceErrors[0]}
              </Alert>
            </ErrorSnackbar>
          )}
          <Vitessce
            config={initializedVitData[vitessceSelection] || initializedVitData}
            theme={vizTheme}
            onConfigChange={handleVitessceConfigDebounced}
            height={vizIsFullscreen ? null : vitessceFixedHeight}
            onWarn={addError}
          />
        </ExpandableDiv>
      </Paper>
      <StyledFooterText variant="body2">
        Powered by&nbsp;
        <Link href="http://vitessce.io" target="_blank" rel="noreferrer">
          Vitessce
        </Link>
      </StyledFooterText>
      <style type="text/css">{vizIsFullscreen ? bodyExpandedCSS : null}</style>
    </StyledSectionContainer>
  );
}

export default Visualization;
