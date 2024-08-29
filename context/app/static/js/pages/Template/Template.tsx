import React from 'react';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import LogInPanel from 'js/shared-styles/panels/LogInPanel';
import { InternalLink } from 'js/shared-styles/Links';
import IconPanel from 'js/shared-styles/panels/IconPanel';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';

const examples = [
  {
    title: 'Example 1',
    description: 'This is an example workspace.',
    data_type: ['RNA-Seq'],
    datasets: ['8ac49b59b3a0471b0b9393942e5d4c70', '70c76b73efa58124e247d6e3a46c85f3'],
  },
  {
    title: 'Example 2',
    description: 'This is another example workspace.',
    data_type: ['Imaging'],
    datasets: ['b2f4e80fd01b9157ba6b5b48154c6b61'],
  },
];

interface TemplateSummaryProps {
  description: string;
  tags: string[];
}

function TemplateSummary({ description, tags }: TemplateSummaryProps) {
  return (
    <Stack component={SummaryPaper} spacing={1}>
      <LabelledSectionText label="Description">{description}</LabelledSectionText>
      <LabelledSectionText label="Tags">
        <Stack spacing={1} marginTop={1} direction="row">
          {tags.map((tag) => (
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
  );
}

interface ExampleAccordionProps {
  example: {
    title: string;
    description: string;
    data_type: string[];
    datasets: string[];
  };
}

function ExampleAccordion({ example: { title, description, data_type, datasets } }: ExampleAccordionProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRoundedIcon sx={(theme) => ({ color: theme.palette.white.main })} />}
        sx={(theme) => ({ backgroundColor: theme.palette.primary.main, color: theme.palette.white.main })}
      >
        <Typography variant="subtitle1" color="inherit" component="h4">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Button variant="contained" sx={{ alignSelf: 'flex-end' }}>
            {' '}
            Clone Workspace{' '}
          </Button>
          <Stack component={SummaryPaper} spacing={1}>
            <LabelledSectionText label="Description">{description}</LabelledSectionText>
            <LabelledSectionText
              label="Dataset Types"
              iconTooltipText="Dataset types that are used in this sample workspace."
            >
              <Stack spacing={1} direction="row">
                {data_type.map((type) => type)}
              </Stack>
            </LabelledSectionText>
          </Stack>
          <WorkspaceDatasetsTable datasetsUUIDs={[...datasets]} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

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
    <Stack spacing={4} marginBottom={5}>
      <Stack spacing={1}>
        <SummaryData
          title={template.title}
          entity_type="Workspace Template"
          entityTypeDisplay={undefined}
          status=""
          mapped_data_access_level=""
        />
        <TemplateSummary description={template.description} tags={template.tags} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h4">Sample Workspaces</Typography>
        {isAuthenticated ? (
          <IconPanel status="info">
            Sample workspaces are provided to help you get started with this template and to better understand the types
            of data that are compatible with it.
          </IconPanel>
        ) : (
          <LogInPanel>
            Sample workspaces are available to help you get started with this template and better understand the types
            of compatible data. Please <InternalLink href="/login">log in</InternalLink> to explore a sample workspace.
          </LogInPanel>
        )}
        {examples.map((example) => (
          <ExampleAccordion key={example.title} example={example} />
        ))}
      </Stack>
    </Stack>
  );
}

export default Template;
