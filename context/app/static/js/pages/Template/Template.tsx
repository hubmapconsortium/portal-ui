import React from 'react';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
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
import { StyledAccordionSummary } from 'js/pages/Template/style';
import { NewWorkspaceDialogFromSample } from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';

interface TemplateSummaryProps {
  description: string;
  tags: string[];
}

function TemplateSummary({ description, tags }: TemplateSummaryProps) {
  return (
    <Stack component={SummaryPaper}>
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
    assay_display_name: string[];
    datasets: string[];
  };
  templateKey: string;
  defaultExpanded?: boolean;
}

function ExampleAccordion({
  example: { title, description, assay_display_name, datasets },
  templateKey,
  defaultExpanded,
}: ExampleAccordionProps) {
  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({
    initialSelectedDatasets: datasets,
    defaultTemplate: templateKey,
  });

  return (
    <>
      <Accordion defaultExpanded={defaultExpanded}>
        <StyledAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon className="accordion-icon" />}>
          <Typography variant="subtitle1" color="inherit" component="h4">
            {title}
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Button
              variant="contained"
              sx={{ alignSelf: 'flex-end' }}
              disabled={!isAuthenticated}
              onClick={() => setDialogIsOpen(true)}
            >
              Try Sample Workspace
            </Button>
            <Stack component={SummaryPaper}>
              <LabelledSectionText label="Description">{description}</LabelledSectionText>
              <LabelledSectionText
                label="Dataset Types"
                iconTooltipText="Dataset types that are used in this sample workspace."
              >
                <Stack spacing={1} direction="row">
                  {assay_display_name.map((type) => type)}
                </Stack>
              </LabelledSectionText>
            </Stack>
            <WorkspaceDatasetsTable datasetsUUIDs={[...datasets]} />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <NewWorkspaceDialogFromSample sample={{ title, description, assay_display_name, datasets }} {...rest} />
    </>
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
      <Stack>
        <SummaryData
          title={template.title}
          entity_type="Workspace Template"
          entityTypeDisplay={undefined}
          status=""
          mapped_data_access_level=""
        />
        <TemplateSummary description={template.description} tags={template.tags} />
      </Stack>
      {template.examples && (
        <Stack spacing={1}>
          <Typography variant="h4">Sample Workspaces</Typography>
          {isAuthenticated ? (
            <IconPanel status="info">
              Sample workspaces are provided to help you get started with this template and to better understand the
              types of data that are compatible with it.
            </IconPanel>
          ) : (
            <LogInPanel>
              Sample workspaces are available to help you get started with this template and better understand the types
              of compatible data. Please <InternalLink href="/login">log in</InternalLink> to explore a sample
              workspace.
            </LogInPanel>
          )}
          {template.examples.map((example, idx) => (
            <ExampleAccordion
              key={example.title}
              example={example}
              templateKey={templateKey}
              defaultExpanded={idx === 0}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default Template;
