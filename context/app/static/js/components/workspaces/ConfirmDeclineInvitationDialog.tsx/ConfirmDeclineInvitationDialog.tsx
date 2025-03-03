import React from 'react';

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

  const handleDeleteAndClose = () => {
    const {
      shared_workspace_id: { id, name },
    } = invitation;

    handleDeleteInvitation(id)
      .then(() => {
        toastSuccessDeclineInvitation(name);
      })
      .catch((e) => {
        console.error(e);
        toastErrorDeclineInvitation(name);
      });
    reset();
  };

  const {
    shared_workspace_id: { name },
  } = invitation;
  const {
    original_workspace_id: {
      user_id: { first_name, last_name },
    },
  } = invitation;

  return (
    <ConfirmationDialog
      title="Decline Workspace Copy Invitation"
      handleClose={reset}
      handleConfirmAndClose={handleDeleteAndClose}
      buttonTitle="Decline"
    >
      You have selected to decline {name} workspace copy invitation, shared by {first_name} {last_name}. This action is
      permanent and cannot be undone. If you need a copy of this workspace in the future, you will need to request a new
      invite.
    </ConfirmationDialog>
  );
}
