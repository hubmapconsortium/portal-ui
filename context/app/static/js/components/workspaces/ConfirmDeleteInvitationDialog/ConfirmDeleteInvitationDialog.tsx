import React from 'react';
import Typography from '@mui/material/Typography';

import { useInvitationsList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';

export default function ConfirmDeleteInvitationDialog() {
  const { handleDeleteInvitation } = useInvitationsList();
  const { invitation, reset } = useEditWorkspaceStore();
  const { toastSuccessDeleteInvitation, toastErrorDeleteInvitation } = useWorkspaceToasts();
  const { currentEventCategory, currentWorkspaceItemName } = useWorkspacesEventContext();

  if (!invitation) {
    return null;
  }

  const {
    original_workspace_id: {
      user_id: { first_name, last_name },
    },
    shared_workspace_id: { id, name },
  } = invitation;

  const isFromLandingPage = currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage;

  const handleDeleteAndClose = () => {
    trackEvent({
      category: currentEventCategory,
      action: `${isFromLandingPage ? 'Workspace Invitations / Sent /' : 'Sent Invitations Status /'} Delete Invitation`,
      label: isFromLandingPage ? id : `${currentWorkspaceItemName} ${id}`,
    });

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
