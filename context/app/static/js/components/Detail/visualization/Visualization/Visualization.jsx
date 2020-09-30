import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Vitessce } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMapRounded';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import { Alert } from 'js/shared-styles/alerts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useEntityStore from 'js/stores/useEntityStore';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  ExpandButton,
  EscSnackbar,
  ErrorSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

const entitySelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
  setVizIsFullscreen: state.setVizIsFullscreen,
  vizTheme: state.vizTheme,
});

function Visualization(props) {
  const { vitData } = props;

  const { vizIsFullscreen, setVizIsFullscreen, vizTheme } = useEntityStore(entitySelector);

  const [isEscSnackbarOpen, setIsEscSnackbarOpen] = useState(false);
  const [vitessceErrors, setVitessceErrors] = useState([]);
  const [vitessceSelection, setVitessceSelection] = useState(0);
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  function handleExpand() {
    setVizIsFullscreen(true);
    setIsEscSnackbarOpen(true);
    // Hack for Safari which lets the user exit from full-window Vitessce,
    // but not take the browser out of full-screen.
    document.onkeydown = function preventDefault(evt) {
      if (evt.keyCode === 27) evt.preventDefault();
    };
  }

  function handleCollapse() {
    setVizIsFullscreen(false);
    setIsEscSnackbarOpen(false);
    // Clear the Safari hack.
    document.onkeydown = null;
  }

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
        handleCollapse();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  return (
    <StyledSectionContainer id="visualization">
      <StyledHeader>
        <StyledHeaderText>Visualization</StyledHeaderText>
        <StyledHeaderRight>
          <VisualizationThemeSwitch />
          <SecondaryBackgroundTooltip title="Switch to Fullscreen">
            <ExpandButton size="small" onClick={handleExpand} variant="contained">
              <ZoomOutMapIcon color="primary" />
            </ExpandButton>
          </SecondaryBackgroundTooltip>
          {Array.isArray(vitData) ? (
            <>
              <SelectionButton
                ref={anchorRef}
                style={{ borderRadius: 3 }}
                onClick={toggle}
                disableElevation
                variant="contained"
                color="primary"
              >
                {vitData[vitessceSelection].name} {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </SelectionButton>
              <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 50 }}>
                <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                  <ClickAwayListener onClickAway={toggle}>
                    <MenuList id="preview-options">
                      {vitData.map(({ name }, i) => (
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
            open={isEscSnackbarOpen}
            autoHideDuration={4000}
            onClose={() => setIsEscSnackbarOpen(false)}
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
            config={vitData[vitessceSelection] || vitData}
            theme={vizTheme}
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
