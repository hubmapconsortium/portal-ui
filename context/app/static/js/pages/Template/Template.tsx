import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
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
import { StyledAccordion } from 'js/components/workspaces/AdvancedConfigOptions/style';
import { NewWorkspaceDialogFromExample } from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';
import { TemplateExample } from 'js/components/workspaces/types';

interface ExampleAccordionProps {
  example: TemplateExample;
  templateKey: string;
  datasetTypeMap: Record<string, string[]>;
  defaultExpanded?: boolean;
}

function ExampleAccordion({ example, templateKey, datasetTypeMap, defaultExpanded }: ExampleAccordionProps) {
  const { title, description, assay_display_name, datasets, job_type, resource_options } = example;

  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({
    defaultName: title,
    defaultTemplate: templateKey,
    defaultJobType: job_type,
    defaultResourceOptions: resource_options,
    initialSelectedDatasets: datasets,
  });

  const getRawDatasetType = useCallback(
    (name: string) => Object.keys(datasetTypeMap).find((key) => datasetTypeMap[key].includes(name)) ?? name,
    [datasetTypeMap],
  );

  return (
    <>
      <StyledAccordion defaultExpanded={defaultExpanded}>
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
                        href={`/search?raw_dataset_type_keyword-assay_display_name_keyword[${getRawDatasetType(name)}][0]=${encodeURI(name)}&entity_type[0]=Dataset`}
                        key={name}
                      >
                        {idx === assay_display_name.length - 1 ? name : `${name}, `}
                      </InternalLink>
                    ))}
                  </Stack>
                </LabelledSectionText>
              )}
            </Stack>
            <WorkspaceDatasetsTable datasetsUUIDs={[...datasets]} isSelectable={false} />
          </Stack>
        </AccordionDetails>
      </StyledAccordion>
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
  const datasetTypeMap = useDatasetTypeMap();

  if (!template) {
    return null;
  }

  return (
    <Stack spacing={4} marginBottom={5}>
      <Stack spacing={2}>
        <SummaryData
          title={template.title}
          entity_type="WorkspaceTemplate"
          entityTypeDisplay="Workspace Template"
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
              datasetTypeMap={datasetTypeMap}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default Template;
