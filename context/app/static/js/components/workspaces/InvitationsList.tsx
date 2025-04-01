import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useInvitationsList } from 'js/components/workspaces/hooks';
import InvitationTabs from 'js/components/workspaces/InvitationTabs';
import Description from 'js/shared-styles/sections/Description';
import NotificationBell from 'js/shared-styles/alerts/NotificationBell';

function InvitationsList() {
  const { sentInvitations, receivedInvitations, invitationsLoading } = useInvitationsList();
  const numNotifications = receivedInvitations.filter((invitation) => !invitation.is_accepted).length;

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h4">Workspace Invitations</Typography>
        <Box>
          <NotificationBell numNotifications={numNotifications} notificationTitle="Pending" />
        </Box>
      </Stack>
      <Description>
        Manage your workspace collaboration with notifications for invitations shared with you or sent by you. For
        received invitations, you can preview the workspace details before deciding to accept or decline the invitation.
      </Description>
      <InvitationTabs
        sentInvitations={sentInvitations}
        receivedInvitations={receivedInvitations}
        isLoading={invitationsLoading}
      />
    </Stack>
  );
}

export default InvitationsList;
