import { useAppContext } from 'js/components/Contexts';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { Typography } from '@mui/material';

function Authenticated({ userEmail }: { userEmail: string }) {
  return <Typography variant="subtitle2">{userEmail[0].toUpperCase()}</Typography>;
}

function Anonymous() {
  return <PersonRounded fontSize="1rem" />;
}

export default function UserIcon() {
  const { userEmail, isAuthenticated } = useAppContext();
  const alt = isAuthenticated ? userEmail : 'Anonymous User';
  const content = isAuthenticated ? <Authenticated userEmail={userEmail} /> : <Anonymous />;
  return (
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
  );
}
