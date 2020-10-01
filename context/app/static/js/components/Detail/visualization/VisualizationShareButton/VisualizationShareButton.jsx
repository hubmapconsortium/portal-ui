import React, { useReducer, useRef } from 'react';

import ShareIcon from '@material-ui/icons/Share';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledWhiteButton } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function VisualizationThemeSwitch(props) {
  const { theme } = props;
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);
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
              <MenuItem>
                <Typography variant="inherit">Copy Visualization Link</Typography>
                <ListItemIcon>
                  <LinkIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem>
                <Typography variant="inherit">Email</Typography>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
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
