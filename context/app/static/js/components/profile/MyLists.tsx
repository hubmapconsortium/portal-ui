import React from 'react';
import Typography from '@mui/material/Typography';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { InternalLink } from 'js/shared-styles/Links';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DetailPageSection } from '../detailPage/style';

export function MyLists() {
  const savedListCount = useSavedEntitiesStore((s) => Object.keys(s.savedLists).length);
  const buttonText = savedListCount === 0 ? 'Create List' : `Manage Lists (${savedListCount})`;
  return (
    <DetailPageSection id="my-lists">
      <Typography variant="h2">My Lists</Typography>
      <SectionPaper>
        <Stack spacing={1} alignItems="start">
          <Typography variant="body1">
            Your lists are currently stored on local storage and are not transferable between devices. To manage your
            lists, navigate to your <InternalLink href="/my-lists">lists</InternalLink>.
          </Typography>
          <Button variant="contained" color="primary" component={InternalLink} href="/my-lists">
            {buttonText}
          </Button>
        </Stack>
      </SectionPaper>
    </DetailPageSection>
  );
}
