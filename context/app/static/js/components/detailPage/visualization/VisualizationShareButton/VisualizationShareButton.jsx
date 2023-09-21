import React, { useReducer, useRef } from 'react';

import ShareIcon from '@mui/icons-material/Share';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Link from '@mui/material/Link';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
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
  const { vitessceState } = useVisualizationStore(visualizationStoreSelector);
  const { toastWarning, toastSuccess } = useSnackbarActions();
  const onClick = () => {
    let urlIsLong = false;
    copyToClipBoard(vitessceState, () => {
      urlIsLong = true;
    });
    const message = `Visualization URL copied to clipboard. ${urlIsLong ? DEFAULT_LONG_URL_WARNING : ''}`.trim();
    const toast = urlIsLong ? toastWarning : toastSuccess;
    toast(message);
    toggle();
  };

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
              <MenuItem onClick={onClick}>
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
