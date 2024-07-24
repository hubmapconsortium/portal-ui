import React from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { SelectedItems } from 'js/hooks/useSelectItems';
import { generateCommaList } from 'js/helpers/functions';

import { MergedWorkspace } from '../types';

interface ConfirmDeleteWorkspacesDialogProps {
  dialogIsOpen: boolean;
  handleClose: () => void;
  handleDeleteWorkspace: (workspaceId: number) => Promise<void>;
  selectedWorkspaceIds: SelectedItems;
  workspacesList: MergedWorkspace[];
}
export default function ConfirmDeleteWorkspacesDialog({
  dialogIsOpen,
  handleClose,
  handleDeleteWorkspace,
  selectedWorkspaceIds,
  workspacesList,
}: ConfirmDeleteWorkspacesDialogProps) {
  const { toastError } = useSnackbarActions();

  const handleDeleteAndClose = () => {
    const workspaceIds = [...selectedWorkspaceIds];

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId)))).catch((e) => {
      toastError(`Error deleting workspaces: ${generateCommaList(workspaceIds)}`);
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
      aria-labelledby="delete-workspace-dialog"
      maxWidth="lg"
    >
      <Stack display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <DialogTitle id="delete-workspace-dialog-title" variant="h3">
          Delete Workspace
          {selectedWorkspaceIds.size > 1 ? 's' : ''}
        </DialogTitle>
        <Box alignContent="center">
          <IconButton aria-label="Close" onClick={handleClose} size="large">
            <CloseRounded />
          </IconButton>
        </Box>
      </Stack>
      <DialogContent>
        You have selected to delete {generateCommaList(selectedWorkspaceNames)}. You cannot undo this action.
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
