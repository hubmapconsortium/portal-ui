import React from 'react';
import Stack from '@mui/material/Stack';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Chip, Typography } from '@mui/material';
import LogInPanel from 'js/shared-styles/panels/LogInPanel';
import { InternalLink } from 'js/shared-styles/Links';

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
    <Stack spacing={4}>
      <Stack spacing={1}>
        <SummaryData
          title={template.title}
          entity_type="Workspace Template"
          entityTypeDisplay={undefined}
          status=""
          mapped_data_access_level=""
        />
        <Stack component={SummaryPaper} spacing={1}>
          <LabelledSectionText label="Description">{template.description}</LabelledSectionText>
          <LabelledSectionText label="Tags">
            <Stack spacing={1} marginTop={1} direction="row">
              {template.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  sx={(theme) => ({ borderRadius: '.5rem', borderColor: theme.palette.grey[200] })}
                />
              ))}
            </Stack>
          </LabelledSectionText>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h4">Sample Workspaces</Typography>
        <LogInPanel>
          Sample workspaces are available to help you get started with this template and better understand the types of
          compatible data. Please <InternalLink href="/login">log in</InternalLink> to explore a sample workspace.
        </LogInPanel>
      </Stack>
    </Stack>
  );
}

export default Template;
