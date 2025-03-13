import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonRounded from '@mui/icons-material/PersonRounded';

import { useAppContext } from 'js/components/Contexts';
import { useInvitationsList } from 'js/components/workspaces/hooks';
import NotificationBell from 'js/shared-styles/alerts/NotificationBell';
import { StyledContainer, StyledNotificationContainer } from './style';

function Authenticated({ userEmail }: { userEmail: string }) {
  return <Typography variant="subtitle2">{userEmail[0].toUpperCase()}</Typography>;
}

function Anonymous() {
  return <PersonRounded fontSize="1rem" />;
}

export default function UserIcon() {
  const { receivedInvitations } = useInvitationsList();
  const numPendingInvitations = receivedInvitations.filter((invitation) => !invitation.is_accepted).length;

  const { userEmail, isAuthenticated } = useAppContext();
  const alt = isAuthenticated ? userEmail : 'Anonymous User';
  const content = isAuthenticated ? <Authenticated userEmail={userEmail} /> : <Anonymous />;
  return (
    <StyledContainer>
      <Avatar
        sx={{
          width: '28px',
          height: '28px',
          bgcolor: '#c5c7cf', // primary-container
          color: (theme) => theme.palette.common.black,
        }}
        alt={alt}
      >
        {content}
      </Avatar>
      <StyledNotificationContainer>
        <NotificationBell numNotifications={numPendingInvitations} />
      </StyledNotificationContainer>
    </StyledContainer>
  );
}
