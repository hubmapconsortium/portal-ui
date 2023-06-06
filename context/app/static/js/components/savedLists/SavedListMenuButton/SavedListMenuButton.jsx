import React, { useCallback, useRef, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { MoreIcon, DeleteIcon } from 'js/shared-styles/icons';
import DialogModal from 'js/shared-styles/DialogModal';

const useSavedEnitiesSelector = (state) => state.queueListToBeDeleted;

function DeleteListButton({ listUUID }) {
  const anchorEl = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [deleteListDialogIsOpen, setDeleteListDialogIsOpen] = useState(false);

  const queueListToBeDeleted = useSavedEntitiesStore(useSavedEnitiesSelector);

  const closeMenuAndDeleteDialog = useCallback(function closeMenuAndDeleteDialog() {
    setMenuIsOpen(false);
    setDeleteListDialogIsOpen(false);
  }, []);

  return (
    <>
      <SecondaryBackgroundTooltip title="More Options">
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
        <MenuItem onClick={() => setDeleteListDialogIsOpen(true)}>
          <DeleteIcon color="primary" />
          <Typography>Delete List</Typography>
        </MenuItem>
      </Menu>
      <DialogModal
        title="Delete List"
        content={<Typography> Are you sure you want to delete this list? You cannot undo this action.</Typography>}
        actions={
          <>
            <Button onClick={closeMenuAndDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              href="/my-lists"
              onClick={() => {
                queueListToBeDeleted(listUUID);
              }}
              color="primary"
            >
              Delete
            </Button>
          </>
        }
        isOpen={deleteListDialogIsOpen}
        handleClose={closeMenuAndDeleteDialog}
      />
    </>
  );
}

export default DeleteListButton;
