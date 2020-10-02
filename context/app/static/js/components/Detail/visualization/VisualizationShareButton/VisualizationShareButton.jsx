import React, { useReducer, useRef } from 'react';

import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useEntityStore from 'js/stores/useEntityStore';
import { StyledWhiteButton, StyledLinkIcon, StyledTypography, StyledEmailIcon } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function VisualizationThemeSwitch(props) {
  const { theme } = props;
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const { vitessceConfig } = useEntityStore();

  const copyToClipBoard = (text) => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  return (
    <>
      <SecondaryBackgroundTooltip title="Share Visualization">
        <StyledWhiteButton ref={anchorRef} onClick={toggle}>
          <ShareIcon color={theme === 'light' ? 'primary' : 'secondary'} />
        </StyledWhiteButton>
      </SecondaryBackgroundTooltip>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 50 }}>
        <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id="preview-options">
              <MenuItem onClick={() => copyToClipBoard(vitessceConfig)}>
                <StyledTypography variant="inherit">Copy Visualization Link</StyledTypography>
                <ListItemIcon>
                  <StyledLinkIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem>
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

export default VisualizationThemeSwitch;
