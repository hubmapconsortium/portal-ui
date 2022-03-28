import React, { useState, useRef } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import { SvgIcon } from '@material-ui/core';
import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const componentId = 'workspaces-menu';

function WorkspaceMenu({ entity_type, uuid }) {
  const anchorEl = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      <SecondaryBackgroundTooltip title="Launch a new workspace in Jupyter notebook.">
        <WhiteBackgroundIconButton
          onClick={() => setMenuIsOpen(true)}
          aria-controls={componentId}
          aria-haspopup="true"
          ref={anchorEl}
        >
          <SvgIcon color="primary" component={WorkspacesIcon} />
        </WhiteBackgroundIconButton>
      </SecondaryBackgroundTooltip>
      <Menu
        id={componentId}
        anchorEl={anchorEl.current}
        keepMounted
        open={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem>
          <Typography component="a" href={`/browse/${entity_type.toLowerCase()}/${uuid}.ipynb`} color="textPrimary">
            Vitessce Visualization Template
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default WorkspaceMenu;
