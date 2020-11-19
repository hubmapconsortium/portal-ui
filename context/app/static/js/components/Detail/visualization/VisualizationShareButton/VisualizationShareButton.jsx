import React, { useReducer, useRef } from 'react';

import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Link from '@material-ui/core/Link';
import { encodeConfInUrl } from 'vitessce';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

import { StyledLinkIcon, StyledTypography, StyledEmailIcon } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

const DEFAULT_LONG_URL_MESSAGE =
  'Warning: this is a long URL which may be incompatible or load slowly with some browsers.';

const DEFAULT_EMAIL_MESSAGE = 'Here is an interesting dataset I found in the HuBMAP Data Portal:';

const visualizationStoreSelector = (state) => ({
  vitessceConfig: state.vitessceConfig,
  setOnCopyUrlMessage: state.setOnCopyUrlMessage,
  setOnCopyUrlSnackbarOpen: state.setOnCopyUrlSnackbarOpen,
});
function VisualizationShareButton() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const { vitessceConfig, setOnCopyUrlMessage, setOnCopyUrlSnackbarOpen } = useVisualizationStore(
    visualizationStoreSelector,
  );

  const copyToClipBoard = (conf) => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    const url = `${window.location.href.split('#')[0]}#${encodeConfInUrl({
      conf,
      onOverMaximumUrlLength: () => {
        setOnCopyUrlMessage(DEFAULT_LONG_URL_MESSAGE);
      },
    })}`;
    setOnCopyUrlSnackbarOpen(true);
    dummy.setAttribute('value', url);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };
  const emailUrl = (conf) => {
    let longUrlMessage = '';
    const url = `${window.location.href.split('#')[0]}#${encodeConfInUrl({
      conf,
      onOverMaximumUrlLength: () => {
        longUrlMessage = DEFAULT_LONG_URL_MESSAGE;
      },
    })}`;
    // We need to encode the URL so its parameters do not conflict with mailto's.
    const encodedUrl = encodeURIComponent(url);
    const mailtoLink = `mailto:?body=${longUrlMessage} ${DEFAULT_EMAIL_MESSAGE} ${encodedUrl}`;
    window.location.href = mailtoLink;
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
              <MenuItem
                onClick={() => {
                  copyToClipBoard(vitessceConfig);
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
                  emailUrl(vitessceConfig);
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
