import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { Alert } from 'js/shared-styles/alerts';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useAppContext } from '../Contexts';
import { useWorkspaces } from '../workspaces/api';

function NonWorkspacesUserView() {
  return (
    <Alert severity="warning">
      Workspaces are currently in beta testing. You must have access to the beta testing group in order to access this
      feature. <ContactUsLink>Contact us</ContactUsLink> for additional information about accessing this feature.
    </Alert>
  );
}

function MainView() {
  const { workspaces, isLoading } = useWorkspaces();

  const numberOfWorkspaces = workspaces?.length || 0;
  const buttonText = numberOfWorkspaces === 0 ? 'Get Started' : `Manage Workspaces (${numberOfWorkspaces})`;

  return (
    <SectionPaper>
      <Stack spacing={1} alignItems="start">
        <LabelledSectionText label="Workspaces Beta Testing Group">
          You currently have access to the workspace feature as part of the Workspace Beta Testing Group. Navigate to
          your workspaces to create new workspaces or manage existing workspaces. For additional information about
          accessing this feature, <ContactUsLink />.
        </LabelledSectionText>
        <LoadingButton variant="contained" color="primary" href="/workspaces" loading={isLoading} fullWidth={false}>
          {buttonText}
        </LoadingButton>
      </Stack>
    </SectionPaper>
  );
}

export function MyWorkspaces() {
  const { isWorkspacesUser } = useAppContext();
  return (
    <CollapsibleDetailPageSection id="workspaces" title="My Workspaces" variant="h2">
      <Stack spacing={1}>{isWorkspacesUser ? <MainView /> : <NonWorkspacesUserView />}</Stack>
    </CollapsibleDetailPageSection>
  );
}
