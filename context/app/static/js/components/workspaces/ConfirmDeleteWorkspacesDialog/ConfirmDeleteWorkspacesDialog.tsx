import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

import { SelectedItems } from 'js/hooks/useSelectItems';
import { generateCommaList } from 'js/helpers/functions';
import { MergedWorkspace } from 'js/components/workspaces/types';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

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
  const { toastErrorDeleteWorkspaces, toastSuccessDeleteWorkspaces } = useWorkspaceToasts();

  const selectedWorkspaceNames = Array.from(selectedWorkspaceIds).map((id) => {
    const workspace = workspacesList.find((w) => w.id === Number(id));
    return workspace ? workspace.name : '';
  });

  const selectedWorkspaceNamesList = generateCommaList(selectedWorkspaceNames);

  const handleDeleteAndClose = useCallback(() => {
    const workspaceIds = [...selectedWorkspaceIds];

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId))))
      .then(() => {
        toastSuccessDeleteWorkspaces(selectedWorkspaceNamesList);
        selectedWorkspaceIds.clear();
      })
      .catch((e) => {
        toastErrorDeleteWorkspaces(selectedWorkspaceNamesList);
        console.error(e);
      });

    handleClose();
  }, [
    handleDeleteWorkspace,
    selectedWorkspaceIds,
    toastSuccessDeleteWorkspaces,
    toastErrorDeleteWorkspaces,
    selectedWorkspaceNamesList,
    handleClose,
  ]);

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
        You have selected to delete {selectedWorkspaceNamesList}. You cannot undo this action.
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
