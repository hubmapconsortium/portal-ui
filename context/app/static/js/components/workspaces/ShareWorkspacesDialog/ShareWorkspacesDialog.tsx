import React, { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';

import { SelectedItems } from 'js/hooks/useSelectItems';
import { useInvitationsList, useWorkspacesList } from 'js/components/workspaces/hooks';
import { StepDescription } from 'js/shared-styles/surfaces/Step';
import UsersAutocomplete from 'js/components/workspaces/UsersAutocomplete';
import { WorkspaceUser } from 'js/components/workspaces/types';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { getSelectedWorkspaceNames } from 'js/components/workspaces/utils';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';

interface ShareWorkspacesDialogProps {
  handleClose: () => void;
  selectedWorkspaceIds: SelectedItems;
}
export default function ShareWorkspacesDialog({ handleClose, selectedWorkspaceIds }: ShareWorkspacesDialogProps) {
  const { workspacesList } = useWorkspacesList();
  const { handleShareInvitations } = useInvitationsList();
  const { toastErrorShareInvitation, toastSuccessShareInvitation } = useWorkspaceToasts();

  const [selectedUsers, setSelectedUsers] = useState<WorkspaceUser[]>([]);

  const selectedWorkspaceNames = getSelectedWorkspaceNames({ selectedWorkspaceIds, workspacesList });

  const handleShareAndClose = useEventCallback(() => {
    const workspaceIds = [...selectedWorkspaceIds];
    const userIds = [...selectedUsers].map((user) => user.id);

    handleShareInvitations({ workspaceIds, userIds })
      .then(() => {
        toastSuccessShareInvitation(selectedWorkspaceNames);
      })
      .catch((e) => {
        console.error(e);
        toastErrorShareInvitation(selectedWorkspaceNames);
      });

    handleClose();
  });

  const description = useMemo(
    () => [
      <Typography key={0}>
        {`Select recipients to share a copy of the selected workspaces: ${selectedWorkspaceNames}. Only users with the necessary workspace permissions will appear in the list. If someone lacks these permissions, they must contact the `}
        <ContactUsLink>HuBMAP help desk</ContactUsLink> for assistance.
      </Typography>,
      'You can search for recipients by first name, last name, or email address. This is not a synchronous sharing feature, so recipients will receive a copy of the workspace at it exists at the time of sharing. When sharing multiple workspaces or sharing to multiple recipients, each invitation is sent separately.',
    ],
    [selectedWorkspaceNames],
  );

  return (
    <ConfirmationDialog
      title={`Share Workspace Cop${selectedWorkspaceIds.size > 1 ? 'ies' : 'y'}`}
      buttonTitle="Share"
      buttonProps={{ color: 'primary' }}
      handleClose={handleClose}
      handleConfirmAndClose={handleShareAndClose}
    >
      <Stack spacing={3} marginBottom={10}>
        <StepDescription blocks={description} />
        <UsersAutocomplete selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      </Stack>
    </ConfirmationDialog>
  );
}
