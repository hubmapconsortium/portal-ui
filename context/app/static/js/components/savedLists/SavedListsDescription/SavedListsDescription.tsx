import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { trackEvent } from 'js/helpers/trackers';
import { SavedListsEventCategories } from 'js/components/savedLists/types';
import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';
import { InternalLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

const handleTrack = () => {
  trackEvent({
    category: SavedListsEventCategories.LandingPage,
    action: 'Log In / From alert',
    label: 'alert banner',
  });
};

function LocalStorageDescription() {
  const { isHubmapUser, isAuthenticated } = useAppContext();

  if (isHubmapUser) {
    return <Description>Lists saved here are stored to your profile and are accessible across devices.</Description>;
  }

  if (isAuthenticated) {
    return (
      <Description>
        You must have the necessary permissions to access and manage your lists. If you need access, contact the{' '}
        <ContactUsLink>HuBMAP Help Desk.</ContactUsLink>
      </Description>
    );
  }

  return (
    <Description>
      <Stack spacing={1}>
        <Typography>
          You must be logged in and have the necessary permissions to access and manage your lists. Any lists previously
          stored locally will be linked to your profile once you{' '}
          <InternalLink href="/login" onClick={handleTrack}>
            log in
          </InternalLink>
          . If you need access to my lists, contact the <ContactUsLink>HuBMAP Help Desk.</ContactUsLink>
        </Typography>
        <Box>
          <Button variant="contained" href="/login" onClick={handleTrack}>
            Log In
          </Button>
        </Box>
      </Stack>
    </Description>
  );
}

export default LocalStorageDescription;
