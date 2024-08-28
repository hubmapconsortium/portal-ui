import React from 'react';
import Stack from '@mui/material/Stack';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Chip } from '@mui/material';

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
  );
}

export default Template;
