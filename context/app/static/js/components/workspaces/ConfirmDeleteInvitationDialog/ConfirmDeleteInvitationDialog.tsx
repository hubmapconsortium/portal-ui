import React from 'react';
import Typography from '@mui/material/Typography';

import { useInvitationsList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

export default function ConfirmDeleteInvitationDialog() {
  const { handleDeleteInvitation } = useInvitationsList();
  const { invitation, reset } = useEditWorkspaceStore();
  const { toastSuccessDeleteInvitation, toastErrorDeleteInvitation } = useWorkspaceToasts();

  if (!invitation) {
    return null;
  }

  const {
    original_workspace_id: {
      user_id: { first_name, last_name },
    },
    shared_workspace_id: { id, name },
  } = invitation;

  const handleDeleteAndClose = () => {
    handleDeleteInvitation(id)
      .then(() => {
        toastSuccessDeleteInvitation(name);
      })
      .catch((e) => {
        console.error(e);
        toastErrorDeleteInvitation(name);
      });
    reset();
  };

  return (
    <ConfirmationDialog
      title="Delete Pending Invitation"
      handleClose={reset}
      handleConfirmAndClose={handleDeleteAndClose}
      buttonTitle="Delete"
    >
      <Typography>
        You have selected to cancel the pending invitation for <strong>{name}</strong>, sent to{' '}
        <strong>
          {first_name} {last_name}
        </strong>
        . This action will cancel the invitation, preventing the recipient from accepting it.
      </Typography>
    </ConfirmationDialog>
  );
}
