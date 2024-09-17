import React from 'react';

import Stack from '@mui/material/Stack';

import { TemplatePreviewSection } from 'js/components/workspaces/workspaceMessaging';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';

function Templates() {
  return (
    <Stack spacing={3}>
      <IconPageTitle icon={WorkspacesIcon}>Templates</IconPageTitle>
      <TemplatePreviewSection trackingInfo={{ category: WorkspacesEventCategories.WorkspaceTemplateLandingPage }} />
    </Stack>
  );
}

export default Templates;
