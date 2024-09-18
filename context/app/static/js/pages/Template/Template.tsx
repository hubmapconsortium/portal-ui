import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { format } from 'date-fns/format';
import { fromUnixTime } from 'date-fns/fromUnixTime';

import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import LogInPanel from 'js/shared-styles/panels/LogInPanel';
import { InternalLink } from 'js/shared-styles/Links';
import IconPanel from 'js/shared-styles/panels/IconPanel';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { StyledButton, StyledChip } from 'js/pages/Template/style';
import { NewWorkspaceDialogFromExample } from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';
import { TemplateExample, WorkspacesEventCategories } from 'js/components/workspaces/types';
import PrimaryColorAccordion from 'js/shared-styles/accordions/PrimaryColorAccordion';
import { trackEvent } from 'js/helpers/trackers';

interface ExampleAccordionProps {
  example: TemplateExample;
  templateKey: string;
  templateName: string;
  defaultExpanded?: boolean;
}

function ExampleAccordion({ example, templateKey, defaultExpanded, templateName }: ExampleAccordionProps) {
  const { title, description, assay_display_name, datasets, job_types, resource_options } = example;

  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({
    defaultName: title,
    defaultTemplate: templateKey,
    defaultJobType: job_types?.[0],
    defaultResourceOptions: resource_options,
    initialSelectedDatasets: datasets,
  });

  const datasetTypeMap = useDatasetTypeMap();
  const assayToRawDatasetMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.keys(datasetTypeMap).forEach((key) => {
      datasetTypeMap[key].forEach((name) => {
        map[name] = key;
      });
    });
    return map;
  }, [datasetTypeMap]);

  return (
    <>
      <PrimaryColorAccordion defaultExpanded={defaultExpanded}>
        <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon className="accordion-icon" />}>
          <Typography variant="subtitle1" color="inherit" component="h4">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <StyledButton
              variant="contained"
              disabled={!isAuthenticated}
              onClick={() => {
                trackEvent({
                  category: WorkspacesEventCategories.WorkspaceTemplateDetailPage,
                  action: 'Open Try Sample Workspace Dialog',
                  label: templateName,
                });
                setDialogIsOpen(true);
              }}
            >
              Try Sample Workspace
            </StyledButton>
            <Stack component={SummaryPaper} spacing={1}>
              <LabelledSectionText label="Description">{description}</LabelledSectionText>
              {assay_display_name && (
                <LabelledSectionText
                  label="Dataset Types"
                  iconTooltipText="Dataset types that are used in this sample workspace."
                >
                  <Stack spacing={1} direction="row">
                    {assay_display_name.map((name, idx) => (
                      <InternalLink
                        onClick={() => {
                          trackEvent({
                            category: WorkspacesEventCategories.WorkspaceTemplateDetailPage,
                            action: 'Navigate to dataset search page from assay type',
                            value: { templateName, name },
                          });
                        }}
                        href={`/search?raw_dataset_type_keyword-assay_display_name_keyword[${assayToRawDatasetMap[name]}][0]=${encodeURI(name)}&entity_type[0]=Dataset`}
                        key={name}
                      >
                        {idx === assay_display_name.length - 1 ? name : `${name}, `}
                      </InternalLink>
                    ))}
                  </Stack>
                </LabelledSectionText>
              )}
            </Stack>
            <WorkspaceDatasetsTable
              datasetsUUIDs={[...datasets]}
              isSelectable={false}
              trackingInfo={{ category: WorkspacesEventCategories.WorkspaceTemplateDetailPage, label: title }}
            />
          </Stack>
        </AccordionDetails>
      </PrimaryColorAccordion>
      <NewWorkspaceDialogFromExample example={example} {...rest} />
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
      <Stack spacing={2}>
        <SummaryData title={template.title} entity_type="WorkspaceTemplate" entityTypeDisplay="Workspace Template" />
        <Stack component={SummaryPaper} spacing={1}>
          <LabelledSectionText label="Description">{template.description}</LabelledSectionText>
          {template.tags.length > 0 && (
            <LabelledSectionText label="Tags">
              <Stack spacing={1} marginTop={1} direction="row">
                {template.tags.map((tag) => (
                  <StyledChip key={tag} label={tag} variant="outlined" />
                ))}
              </Stack>
            </LabelledSectionText>
          )}
          {template?.last_modified_unix_timestamp && (
            <LabelledSectionText
              label="Last Modified"
              iconTooltipText="Date when this template was last modified by its template provider."
            >
              {format(fromUnixTime(template.last_modified_unix_timestamp), 'yyyy-MM-dd')}
            </LabelledSectionText>
          )}
        </Stack>
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
            <LogInPanel trackingInfo={{ category: WorkspacesEventCategories.WorkspaceTemplateDetailPage }}>
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
              templateName={template.title}
              defaultExpanded={idx === 0}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default Template;
