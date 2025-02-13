import React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Description from 'js/shared-styles/sections/Description';
import { useInvitationsList } from 'js/components/workspaces/hooks';
import InvitationsTabs from 'js/components/workspaces/InvitationsTabs';

function WorkspaceInvitations() {
  const { sentInvitations, receivedInvitations, invitationsLoading: isLoading } = useInvitationsList();

  return (
    <Stack spacing={1}>
      <Typography variant="h4">Workspace Invitations</Typography>
      <Description>
        Manage your workspace collaboration with notifications for invitations shared with you or sent by you. For
        received invitations, you can preview the workspace details before deciding to accept or decline the invitation.
      </Description>
      <InvitationsTabs
        sentInvitations={sentInvitations}
        receivedInvitations={receivedInvitations}
        isLoading={isLoading}
      />
    </Stack>
  );
}

export default WorkspaceInvitations;
