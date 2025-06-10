import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useAppContext } from '../../Contexts';
import { ProfileGroups } from './Groups';
import { ProfileTitle } from './Title';
import { ProfileDescription } from './Description';

function LogInAlertMessage() {
  return (
    <>
      You must be logged in to view access levels and profile features. <ContactUsLink capitalize /> to learn more about
      membership.
    </>
  );
}

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

export function ProfileSummaryUnauthenticated() {
  return (
    <DetailPageSection id="summary">
      <Stack spacing={1}>
        <ProfileTitle title="Not Logged In" />
        <Typography variant="h2">Profile</Typography>
        <LoginAlert
          message={<LogInAlertMessage />}
          alertProps={{ sx: { padding: '16px 12px', '&.MuiAlert-root': { backgroundColor: 'background.paper' } } }}
        />
      </Stack>
    </DetailPageSection>
  );
}
