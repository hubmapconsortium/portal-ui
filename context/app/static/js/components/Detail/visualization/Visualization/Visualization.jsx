import React, { useState, useEffect, useReducer, useRef, useCallback, useMemo } from 'react';
import { Vitessce, decodeURLParamsToConf } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import debounce from 'lodash/debounce';

import { Alert } from 'js/shared-styles/alerts';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import VisualizationShareButton from '../VisualizationShareButton';
import VisualizationFullScreenButton from '../VisualizationFullScreenButton';
import {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  EscSnackbar,
  ErrorSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

const visualizationStoreSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
  collapseViz: state.collapseViz,
  vizTheme: state.vizTheme,
  vizEscSnackbarIsOpen: state.vizEscSnackbarIsOpen,
  setVizEscSnackbarIsOpen: state.setVizEscSnackbarIsOpen,
  vitessceConfig: state.vitessceConfig,
  setVitessceConfig: state.setVitessceConfig,
});

function Visualization(props) {
  const { vitData } = props;

  const {
    vizIsFullscreen,
    collapseViz,
    vizTheme,
    vizEscSnackbarIsOpen,
    setVizEscSnackbarIsOpen,
    setVitessceConfig,
  } = useVisualizationStore(visualizationStoreSelector);

  // Get the vitessce configuration from the url if available and set the initial selection if it is a multi-dataset.
  const [initializedVitData, initialSelection] = useMemo(() => {
    const queryString = window.location.href.split('?')[1];
    const vitessceURLConf = queryString?.length > 0 ? decodeURLParamsToConf(queryString) : null;
    const initialSelectionFromUrl =
      Array.isArray(vitData) && Math.max(0, vitData.map(({ name }) => name).indexOf(vitessceURLConf?.name));
    let initializedVitDataFromUrl = vitData;
    if (Array.isArray(vitData)) {
      initializedVitDataFromUrl[initialSelectionFromUrl] = vitessceURLConf || vitData[initialSelectionFromUrl];
    } else {
      initializedVitDataFromUrl = vitessceURLConf || vitData;
    }
    return [initializedVitDataFromUrl, initialSelectionFromUrl];
  }, [vitData]);

  const [vitessceErrors, setVitessceErrors] = useState([]);
  const [vitessceSelection, setVitessceSelection] = useState(initialSelection);
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const handleVitessceConfigDebounced = useCallback(debounce(setVitessceConfig, 250, { trailing: true }), [
    setVitessceConfig,
  ]);
  function removeError(message) {
    setVitessceErrors((prev) => prev.filter((d) => d !== message));
  }

  function addError(message) {
    setVitessceErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
  }

  function setSelectionAndClearErrors(i) {
    setVitessceErrors([]);
    setVitessceSelection(i);
    toggle();
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
          <VisualizationFullScreenButton />
          {Array.isArray(initializedVitData) ? (
            <>
              <SelectionButton
                ref={anchorRef}
                style={{ borderRadius: 3 }}
                onClick={toggle}
                disableElevation
                variant="contained"
                color="primary"
              >
                {initializedVitData[vitessceSelection].name} {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </SelectionButton>
              <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 50 }}>
                <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                  <ClickAwayListener onClickAway={toggle}>
                    <MenuList id="preview-options">
                      {initializedVitData.map(({ name }, i) => (
                        <MenuItem onClick={() => setSelectionAndClearErrors(i)} key={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Popper>
            </>
          ) : null}
        </StyledHeaderRight>
      </StyledHeader>
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={vizTheme}>
          <EscSnackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={vizEscSnackbarIsOpen}
            autoHideDuration={4000}
            onClose={() => setVizEscSnackbarIsOpen(false)}
            message="Press [esc] to exit full window."
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
