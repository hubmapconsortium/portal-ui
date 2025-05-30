import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { useAppContext } from '../../Contexts';
import { ProfileGroups } from './Groups';
import { ProfileTitle } from './Title';
import { ProfileDescription } from './Description';

export function ProfileSummary() {
  const { userEmail } = useAppContext();

  return (
    <DetailPageSection id="summary">
      <Stack spacing={1}>
        <ProfileTitle />
        <Typography variant="h2">{userEmail}</Typography>
        <ProfileDescription />
        <ProfileGroups />
      </Stack>
    </DetailPageSection>
  );
}
