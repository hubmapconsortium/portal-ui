import React from 'react';

import Stack from '@mui/material/Stack';

import { TemplateGridPreview, TemplateLogInBanner } from 'js/components/workspaces/workspaceMessaging';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';

function Templates() {
  return (
    <Stack spacing={3}>
      <IconPageTitle icon={WorkspacesIcon}>Templates</IconPageTitle>
      {!isAuthenticated && <TemplateLogInBanner />}
      <TemplateGridPreview />
    </Stack>
  );
}

export default Templates;
