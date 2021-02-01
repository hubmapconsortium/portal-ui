import React, { useRef, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { MoreIcon, DeleteIcon } from 'js/shared-styles/icons';

function DeleteListButton() {
  const anchorEl = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      <SecondaryBackgroundTooltip title="Delete Items">
        <WhiteBackgroundIconButton
          onClick={() => setMenuIsOpen(true)}
          aria-controls="list-actions-menu"
          aria-haspopup="true"
          ref={anchorEl}
        >
          <MoreIcon color="primary" />
        </WhiteBackgroundIconButton>
      </SecondaryBackgroundTooltip>
      <Menu
        id="list-actions-menu"
        anchorEl={anchorEl.current}
        keepMounted
        open={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
      >
        <MenuItem>
          <DeleteIcon color="primary" />
          <Typography>Delete List</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default DeleteListButton;
