import React, { useReducer, useRef } from 'react';

import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

import { StyledLinkIcon, StyledTypography, StyledEmailIcon } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

const visualizationStoreSelector = (state) => ({
  vizTheme: state.vizTheme,
  vitessceConfig: state.vitessceConfig,
});
function VisualizationThemeSwitch() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
  const { vizTheme, vitessceConfig } = useVisualizationStore(visualizationStoreSelector);

  const copyToClipBoard = (conf) => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    const url = `${window.location.href}?vitessce_conf=${JSON.stringify(conf)}`;
    dummy.setAttribute('value', url);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };
  return (
    <>
      <SecondaryBackgroundTooltip title="Share Visualization">
        <WhiteBackgroundIconButton ref={anchorRef} onClick={toggle}>
          <ShareIcon color={vizTheme === 'light' ? 'primary' : 'secondary'} />
        </WhiteBackgroundIconButton>
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
