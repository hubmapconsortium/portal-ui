import React from 'react';
import { format } from 'date-fns/format';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';

import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useWorkspaceDetail } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import { EditIcon } from 'js/shared-styles/icons';
import WorkspacesUpdateButton from 'js/components/workspaces/WorkspacesUpdateButton';
import { MergedWorkspace, WorkspacesEventCategories } from 'js/components/workspaces/types';
import { buildSearchLink } from 'js/components/search/store';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { DetailPageSection } from 'js/components/detailPage/DetailPageSection';

const tooltips = {
  name: 'Edit workspace name or description.',
  templates: 'Add templates to this workspace.',
  currentTemplates: 'Templates that are currently in this workspace.',
};

// const noDatasetsText =
//   'There are no datasets in this workspace. Navigate to the dataset search page to find and add datasets to your workspace.';

const pages = [
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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- this is a valid use case
  const variant = props?.children?.toString() === 'Stop Jobs' ? 'outlined' : 'contained';
  return <Button {...props} variant={variant} />;
}

function SummaryTitle({
  workspace,
  handleStopWorkspace,
  isStoppingWorkspace,
}: {
  workspace: MergedWorkspace;
  handleStopWorkspace: (id: number) => Promise<void>;
  isStoppingWorkspace: boolean;
}) {
  const { name, jobs } = workspace;
  const job = condenseJobs(jobs);

  return (
    <SummaryData
      title={name}
      entity_type="Workspace"
      entityTypeDisplay={undefined}
      otherButtons={
        <Stack direction="row" alignItems="center" spacing={1}>
          <WorkspacesUpdateButton
            workspace={workspace}
            dialogType="UPDATE_NAME"
            tooltip={tooltips.name}
            trackingInfo={{
              category: WorkspacesEventCategories.WorkspaceDetailPage,
              action: 'Launch Edit Workspace Dialog',
              label: name,
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
            showIcons
          />
        </Stack>
      }
    >
      <Typography variant="subtitle1" component="p" marginTop={2}>
        <JobStatus job={job} />
      </Typography>
    </SummaryData>
  );
}

function SummaryBody({ workspace }: { workspace: MergedWorkspace }) {
  const { datetime_created, description } = workspace;

  return (
    <SectionPaper>
      <Stack spacing={2}>
        <LabelledSectionText label="Description">{description}</LabelledSectionText>
        <LabelledSectionText label="Creation Date">
          {format(new Date(datetime_created), 'yyyy-MM-dd')}
        </LabelledSectionText>
        <RelevantPagesSection pages={pages} />
      </Stack>
    </SectionPaper>
  );
}

function Summary({
  workspace,
  handleStopWorkspace,
  isStoppingWorkspace,
}: {
  workspace: MergedWorkspace;
  handleStopWorkspace: (id: number) => Promise<void>;
  isStoppingWorkspace: boolean;
}) {
  return (
    <DetailPageSection id="summary">
      <Box>
        <SummaryTitle
          workspace={workspace}
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
        />
        <SummaryBody workspace={workspace} />
      </Box>
    </DetailPageSection>
  );
}

function WorkspacePage({ workspaceId }: WorkspacePageProps) {
  const { workspace, isLoading, handleStopWorkspace, isStoppingWorkspace } = useWorkspaceDetail({ workspaceId });

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const shouldDisplaySection = {
    summary: true,
    'sent-invitations-status': true,
    datasets: true,
    templates: true,
  };

  return (
    <WorkspacesAuthGuard>
      <DetailLayout sections={shouldDisplaySection}>
        {/* <WorkspaceContent workspaceId={workspaceId} /> */}
        <Stack gap={6} sx={{ marginBottom: 5 }}>
          <WorkspaceSessionWarning workspaces={[workspace]} />
          <Summary
            workspace={workspace}
            handleStopWorkspace={handleStopWorkspace}
            isStoppingWorkspace={isStoppingWorkspace}
          />
          {/* <WorkspaceDatasetsTable
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
          </Box> */}
        </Stack>
      </DetailLayout>
    </WorkspacesAuthGuard>
  );
}

export default WorkspacePage;
