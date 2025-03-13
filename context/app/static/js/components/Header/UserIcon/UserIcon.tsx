import { useAppContext } from 'js/components/Contexts';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { Typography } from '@mui/material';
import { useInvitationsList } from 'js/components/workspaces/hooks';
import { StyledContainer, StyledNotificationContainer } from 'js/components/Header/UserIcon/style';
import HeaderNotification from 'js/components/Header/HeaderNotification';

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
          width: '30px',
          height: '30px',
          bgcolor: '#c5c7cf', // primary-container
          color: (theme) => theme.palette.common.black,
        }}
        alt={alt}
      >
        {content}
      </Avatar>
      {numPendingInvitations > 0 && (
        <StyledNotificationContainer>
          <HeaderNotification numNotifications={numPendingInvitations} />
        </StyledNotificationContainer>
      )}
    </StyledContainer>
  );
}
