import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import IconButton from '@mui/material/IconButton/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { SelectedItems } from 'js/hooks/useSelectItems';

import { useWorkspacesList } from '../hooks';
import { MergedWorkspace } from '../types';

const genCommaList = (list: string[]): string => {
  const { length } = list;

  return length < 2
    ? list.join('')
    : `${list.slice(0, length - 1).join(', ')}${length < 3 ? ' and ' : ', and '}${list[length - 1]}`;
};

interface ConfirmDeleteWorkspacesDialogProps {
  dialogIsOpen: boolean;
  handleClose: () => void;
  selectedWorkspaceIds: SelectedItems;
  workspacesList: MergedWorkspace[];
}
export default function ConfirmDeleteWorkspacesDialog({
  dialogIsOpen,
  handleClose,
  selectedWorkspaceIds,
  workspacesList,
}: ConfirmDeleteWorkspacesDialogProps) {
  const { handleDeleteWorkspace } = useWorkspacesList();
  const { toastError } = useSnackbarActions();

  const handleDeleteAndClose = () => {
    const workspaceIds = [...selectedWorkspaceIds];

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId)))).catch((e) => {
      toastError(`Error deleting workspaces: ${workspaceIds.join(', ')}`);
      console.error(e);
    });

    selectedWorkspaceIds.clear();
    handleClose();
  };

  const selectedWorkspaceNames = Array.from(selectedWorkspaceIds).map((id) => {
    const workspace = workspacesList.find((w) => w.id === Number(id));
    return workspace ? workspace.name : '';
  });

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="create-workspace-dialog-title"
      maxWidth="lg"
    >
      <Stack display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <DialogTitle id="delete-workspace-dialog-title" variant="h3">
          Delete Workspace
        </DialogTitle>
        <Box alignContent="center">
          <IconButton aria-label="Close" onClick={handleClose} size="large">
            <CloseRounded />
          </IconButton>
        </Box>
      </Stack>
      <DialogContent>
        You have selected to delete
        {` ${genCommaList(selectedWorkspaceNames)}`}. You cannot undo this action.
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteAndClose} variant="contained" color="warning">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
