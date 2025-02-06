import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';
import { InternalLink } from 'js/shared-styles/Links';

function LocalStorageDescription() {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Description>Lists saved here are stored to your profile and are accessible across devices.</Description>;
  }

  return (
    <Description>
      <Stack spacing={1}>
        <Typography>
          <InternalLink href="/login">Log in</InternalLink> to access and manage your saved lists. Any lists previously
          stored locally will be linked to your profile once you <InternalLink href="/login">log in</InternalLink>.
        </Typography>
        <Box>
          <Button variant="contained" href="/login">
            Log In
          </Button>
        </Box>
      </Stack>
    </Description>
  );
}

export default LocalStorageDescription;
