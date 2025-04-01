import React from 'react';

import Stack from '@mui/material/Stack';

import { TemplatePreviewSection } from 'js/components/workspaces/workspaceMessaging';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { WorkspacesEventContextProvider } from 'js/components/workspaces/contexts';

function Templates() {
  return (
    <WorkspacesEventContextProvider currentEventCategory={WorkspacesEventCategories.WorkspaceTemplateLandingPage}>
      <Stack spacing={3}>
        <IconPageTitle icon={WorkspacesIcon} data-testid="templates-title">
          Templates
        </IconPageTitle>
        <TemplatePreviewSection />
      </Stack>
    </WorkspacesEventContextProvider>
  );
}

export default Templates;
