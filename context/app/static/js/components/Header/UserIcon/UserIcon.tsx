import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import PersonRounded from '@mui/icons-material/PersonRounded';

import { useAppContext } from 'js/components/Contexts';
import { useInvitationsList } from 'js/components/workspaces/hooks';

function Authenticated({ userEmail }: { userEmail: string }) {
  // The avatar background is the same in both modes, so pin the text to the light-mode subtitle color.
  return (
    <Typography variant="subtitle2" sx={{ color: 'common.brand' }}>
      {userEmail[0].toUpperCase()}
    </Typography>
  );
}

function Anonymous() {
  return <PersonRounded fontSize="1rem" />;
}

export default function UserIcon() {
  const { numPendingReceivedInvitations } = useInvitationsList();
  const { userEmail, isAuthenticated } = useAppContext();

  const alt = isAuthenticated ? userEmail : 'Anonymous User';
  const content = isAuthenticated ? <Authenticated userEmail={userEmail} /> : <Anonymous />;

  return (
    <Badge badgeContent={numPendingReceivedInvitations} color="warning">
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
    </Badge>
  );
}
