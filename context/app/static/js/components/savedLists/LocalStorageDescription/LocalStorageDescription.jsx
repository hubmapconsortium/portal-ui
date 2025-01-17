import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';
import { InternalLink } from 'js/shared-styles/Links';
import { Box, Button, Stack, Typography } from '@mui/material';

function LocalStorageDescription() {
  const { isAuthenticated } = useAppContext()

  if (isAuthenticated) {
    return (
      <Description padding="20px">
        Lists saved here are stored to your profile and accessible across devices.
      </Description>
    );
  }

  return (
    <Description padding={2}>
      <Stack spacing={1}>
        <Typography>
          Your lists are saved locally on your device and are not associated with your profile. <InternalLink href="/login">Log in</InternalLink> to access and manage lists linked to your profile.
        </Typography>
        <Box>
          <Button variant="contained" href="/login">Log In</Button>
        </Box>
      </Stack>
    </Description>
  );
}

export default LocalStorageDescription;
