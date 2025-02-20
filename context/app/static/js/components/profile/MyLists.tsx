import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import useSavedLists from 'js/components/savedLists/hooks';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';

export function MyLists() {
  const { savedLists } = useSavedLists();
  const savedListCount = Object.keys(savedLists).length;

  const buttonText = savedListCount === 0 ? 'Create List' : `Manage Lists (${savedListCount})`;
  return (
    <CollapsibleDetailPageSection id="my-lists" title="My Lists" component="h2" variant="h2">
      <SectionPaper>
        <Stack spacing={1} alignItems="start">
          <Typography variant="body1">
            Lists saved here are stored to your profile and accessible across devices.
          </Typography>
          <Button variant="contained" color="primary" href="/my-lists">
            {buttonText}
          </Button>
        </Stack>
      </SectionPaper>
    </CollapsibleDetailPageSection>
  );
}
