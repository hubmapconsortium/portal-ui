import React, { useReducer, useRef } from 'react';

import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Link from '@material-ui/core/Link';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { copyToClipBoard, createEmailWithUrl } from './utils';
import { DEFAULT_LONG_URL_WARNING } from './constants';

import { StyledLinkIcon, StyledTypography, StyledEmailIcon } from './style';

const visualizationStoreSelector = (state) => ({
  vitessceState: state.vitessceState,
  setOnCopyUrlWarning: state.setOnCopyUrlWarning,
  setOnCopyUrlSnackbarOpen: state.setOnCopyUrlSnackbarOpen,
});

function VisualizationShareButton() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const { vitessceState, setOnCopyUrlWarning, setOnCopyUrlSnackbarOpen } =
    useVisualizationStore(visualizationStoreSelector);

  return (
    <>
      <SecondaryBackgroundTooltip title="Share Visualization">
        <WhiteBackgroundIconButton ref={anchorRef} onClick={toggle}>
          <ShareIcon color="primary" />
        </WhiteBackgroundIconButton>
      </SecondaryBackgroundTooltip>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 50 }}>
        <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id="preview-options">
              <MenuItem
                onClick={() => {
                  copyToClipBoard(vitessceState, () => {
                    setOnCopyUrlWarning(DEFAULT_LONG_URL_WARNING);
                  });
                  setOnCopyUrlSnackbarOpen(true);
                  toggle();
                }}
              >
                <StyledTypography variant="inherit">Copy Visualization Link</StyledTypography>
                <ListItemIcon>
                  <StyledLinkIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  createEmailWithUrl(vitessceState);
                  toggle();
                }}
                component={Link}
              >
                <StyledTypography variant="inherit">Email</StyledTypography>
                <ListItemIcon>
                  <StyledEmailIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

export default VisualizationShareButton;
