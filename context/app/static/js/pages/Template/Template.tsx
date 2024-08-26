import React from 'react';

import { Stack } from '@mui/material';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';

interface TemplatePageProps {
  templateKey: string;
}

function Template({ templateKey }: TemplatePageProps) {
  const { templates } = useWorkspaceTemplates();
  const template = templates[templateKey];

  return <Stack spacing={3}>{template?.title}</Stack>;
}

export default Template;
