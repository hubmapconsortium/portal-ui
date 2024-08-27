import React from 'react';

import { Stack } from '@mui/material';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import { WorkspacesIcon } from 'js/shared-styles/icons';

interface TemplatePageProps {
  templateKey: string;
}

function Template({ templateKey }: TemplatePageProps) {
  const { templates } = useWorkspaceTemplates();
  const template = templates[templateKey];

  if (!template) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <IconPageTitle icon={WorkspacesIcon}>{template?.title}</IconPageTitle>
    </Stack>
  );
}

export default Template;
