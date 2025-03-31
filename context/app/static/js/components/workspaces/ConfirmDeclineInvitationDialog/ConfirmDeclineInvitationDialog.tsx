import React from 'react';
import Typography from '@mui/material/Typography';

import { useInvitationsList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

export default function ConfirmDeclineInvitationDialog() {
  const { handleDeleteInvitation } = useInvitationsList();
  const { invitation, reset } = useEditWorkspaceStore();
  const { toastSuccessDeclineInvitation, toastErrorDeclineInvitation } = useWorkspaceToasts();

  if (!invitation) {
    return null;
  }

  const {
    shared_workspace_id: { id, name },
  } = invitation;
  const {
    original_workspace_id: {
      user_id: { first_name, last_name },
    },
  } = invitation;

  const handleDeleteAndClose = () => {
    handleDeleteInvitation(id)
      .then(() => {
        // Redirect to the workspaces landing page if on a deleted invitation detail page
        if (window.location.href.includes('/invitations')) {
          window.location.href = `/workspaces`;
        }
        toastSuccessDeclineInvitation(name);
      })
      .catch((e) => {
        console.error(e);
        toastErrorDeclineInvitation(name);
      });
    reset();
  };

  return (
    <ConfirmationDialog
      title="Decline Workspace Copy Invitation"
      handleClose={reset}
      handleConfirmAndClose={handleDeleteAndClose}
      buttonTitle="Decline"
    >
      <Typography>
        You have selected to decline a workspace copy invitation titled <strong>{name}</strong>, shared by{' '}
        <strong>
          {first_name} {last_name}
        </strong>
        . This action is permanent and cannot be undone. If you need a copy of this workspace in the future, you will
        need to request a new invite.
      </Typography>
    </ConfirmationDialog>
  );
}
