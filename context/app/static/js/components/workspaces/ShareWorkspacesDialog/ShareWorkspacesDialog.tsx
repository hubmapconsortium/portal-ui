import React, { useCallback, useMemo, useState } from 'react';

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
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { StepDescription } from 'js/shared-styles/surfaces/Step';
import UsersAutocomplete from 'js/components/workspaces/UsersAutocomplete';
import { WorkspaceUser } from 'js/components/workspaces/types';
import { Typography } from '@mui/material';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

interface ShareWorkspacesDialogProps {
  handleClose: () => void;
  selectedWorkspaceIds: SelectedItems;
}
export default function ShareWorkspacesDialog({ handleClose, selectedWorkspaceIds }: ShareWorkspacesDialogProps) {
  const { toastErrorDeleteWorkspaces, toastSuccessDeleteWorkspaces } = useWorkspaceToasts();
  const { workspacesList, handleDeleteWorkspace } = useWorkspacesList();
  const [selectedUsers, setSelectedUsers] = useState<WorkspaceUser[]>([]);

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

  const description = useMemo(
    () => [
      <Typography key={0}>
        {`Select recipients to share a copy of the selected workspaces: ${selectedWorkspaceNamesList}. Only users with the necessary workspace permissions will appear in the list. If someone lacks these permissions, they must contact the `}
        <ContactUsLink>HuBMAP help desk</ContactUsLink> for assistance.
      </Typography>,
      'You can search for recipients by first name, last name, or email address. This is not a synchronous sharing feature, so recipients will receive a copy of the workspace at it exists at the time of sharing. When sharing multiple workspaces or sharing to multiple recipients, each invitation is sent separately.',
    ],
    [selectedWorkspaceNamesList],
  );

  const multipleSelected = selectedWorkspaceIds.size > 1;

  return (
    <Dialog open onClose={handleClose} scroll="paper" aria-labelledby="share-workspace-dialog" maxWidth="lg">
      <Stack display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <DialogTitle id="share-workspace-dialog-title" variant="h3">
          {`Share Workspace${multipleSelected ? 's' : ''} Cop${multipleSelected ? 'ies' : 'y'}`}
        </DialogTitle>
        <Box alignContent="center">
          <IconButton aria-label="Close" onClick={handleClose} size="large">
            <CloseRounded />
          </IconButton>
        </Box>
      </Stack>
      <Box sx={{ px: 3 }}>
        <StepDescription blocks={description} />
      </Box>
      <DialogContent>
        <UsersAutocomplete selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteAndClose} variant="contained">
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
}
