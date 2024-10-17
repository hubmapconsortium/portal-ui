import React from 'react';
import { format } from 'date-fns/format';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';

import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useWorkspaceDetail } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import { EditIcon, AddIcon } from 'js/shared-styles/icons';
import WorkspacesUpdateButton from 'js/components/workspaces/WorkspacesUpdateButton';
import { Alert } from 'js/shared-styles/alerts/Alert';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { buildSearchLink } from 'js/components/search/store';

const tooltips = {
  name: 'Edit workspace name.',
  templates: 'Add templates to this workspace.',
  currentTemplates: 'Templates that are currently in this workspace.',
};

const noDatasetsText =
  'There are no datasets in this workspace. Navigate to the dataset search page to find and add datasets to your workspace.';

const pageLinks = [
  {
    link: '/workspaces',
    children: 'My Workspaces',
  },
  {
    link: buildSearchLink({
      entity_type: 'Dataset',
    }),
    children: 'Dataset Search Page',
  },
];

interface WorkspacePageProps {
  workspaceId: number;
}

function LaunchStopButton(props: ButtonProps) {
  const variant = props?.children?.toString() === 'Stop Jobs' ? 'outlined' : 'contained';
  return <Button {...props} variant={variant} />;
}

function WorkspaceContent({ workspaceId }: WorkspacePageProps) {
  const { workspace, workspaceTemplates, workspaceDatasets, isLoading, handleStopWorkspace, isStoppingWorkspace } =
    useWorkspaceDetail({ workspaceId });

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const job = condenseJobs(workspace.jobs);

  return (
    <Stack gap={6} sx={{ marginBottom: 5 }}>
      <WorkspaceSessionWarning workspaces={[workspace]} />
      <Box>
        <SummaryData
          title={workspace.name}
          entity_type="Workspace"
          entityTypeDisplay={undefined}
          otherButtons={
            <>
              <WorkspacesUpdateButton
                workspace={workspace}
                dialogType="UPDATE_NAME"
                sx={(theme) => ({
                  marginRight: theme.spacing(1),
                })}
                tooltip={tooltips.name}
                trackingInfo={{
                  category: WorkspacesEventCategories.WorkspaceDetailPage,
                  action: 'Launch Edit Workspace Dialog',
                  label: workspace.name,
                }}
              >
                <EditIcon />
              </WorkspacesUpdateButton>
              <WorkspaceLaunchStopButtons
                workspace={workspace}
                button={LaunchStopButton}
                handleStopWorkspace={handleStopWorkspace}
                isStoppingWorkspace={isStoppingWorkspace}
                trackingInfo={{ category: WorkspacesEventCategories.WorkspaceDetailPage }}
                showLaunch
                showStop
              />
            </>
          }
        >
          <Typography variant="subtitle1" component="p" marginTop={2}>
            <JobStatus job={job} />
          </Typography>
        </SummaryData>
        <SectionPaper>
          <Stack spacing={1}>
            <LabelledSectionText label="Creation Date">
              {format(new Date(workspace.datetime_created), 'yyyy-MM-dd')}
            </LabelledSectionText>
            <LabelledSectionText label="Relevant Pages" spacing={1}>
              <Stack direction="row" spacing={1}>
                {pageLinks.map((page) => (
                  <OutlinedLinkButton key={page.link} {...page} />
                ))}
              </Stack>
            </LabelledSectionText>
          </Stack>
        </SectionPaper>
      </Box>
      <WorkspaceDatasetsTable
        datasetsUUIDs={workspaceDatasets}
        label={<SectionHeader>Datasets</SectionHeader>}
        hideTableIfEmpty
        addDatasets={workspace}
        copyDatasets
        trackingInfo={{
          category: WorkspacesEventCategories.WorkspaceDetailPage,
          label: workspace.name,
        }}
        emptyAlert={
          <Alert
            severity="info"
            action={
              <Button>
                <InternalLink
                  href={buildSearchLink({
                    entity_type: 'Dataset',
                  })}
                >
                  <Typography color="primary" variant="button">
                    Dataset Search Page
                  </Typography>
                </InternalLink>
              </Button>
            }
          >
            {noDatasetsText}
          </Alert>
        }
      />
      <Box>
        <SpacedSectionButtonRow
          leftText={<SectionHeader iconTooltipText={tooltips.currentTemplates}>Current Templates</SectionHeader>}
          buttons={
            <WorkspacesUpdateButton workspace={workspace} dialogType="UPDATE_TEMPLATES" tooltip={tooltips.templates}>
              <AddIcon />
            </WorkspacesUpdateButton>
          }
        />
        <TemplateGrid
          templates={workspaceTemplates}
          trackingInfo={{ category: WorkspacesEventCategories.WorkspaceDetailPage }}
        />
      </Box>
    </Stack>
  );
}

function WorkspacePage({ workspaceId }: WorkspacePageProps) {
  return (
    <WorkspacesAuthGuard>
      <WorkspaceContent workspaceId={workspaceId} />
    </WorkspacesAuthGuard>
  );
}

export default WorkspacePage;
