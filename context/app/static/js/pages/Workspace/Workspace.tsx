import React from 'react';
import { format } from 'date-fns/format';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ShareIcon from '@mui/icons-material/Share';
import Button, { ButtonProps } from '@mui/material/Button';

import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useInvitationWorkspaceDetails } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import { EditIcon, EmailIcon } from 'js/shared-styles/icons';
import WorkspacesUpdateButton from 'js/components/workspaces/WorkspacesUpdateButton';
import { MergedWorkspace, WorkspaceUser, WorkspacesEventCategories } from 'js/components/workspaces/types';
import { buildSearchLink } from 'js/components/search/store';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { DetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { StyledSvgIcon } from 'js/components/workspaces/style';
import { WorkspaceButton } from 'js/components/workspaces/WorkspaceButton';
import { TooltipButton } from 'js/shared-styles/buttons/TooltipButton';
import { OutboundLink } from 'js/shared-styles/Links';
import WorkspacesListDialogs from 'js/components/workspaces/WorkspacesListDialogs';

const tooltips = {
  update: 'Edit workspace name or description.',
  lastLaunched: 'Date of the last launched session.',
  lastModified: 'Date of the last modification to the content of the workspace.',
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
  const { setDialogType } = useEditWorkspaceStore();
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
            tooltip={tooltips.update}
            trackingInfo={{
              category: WorkspacesEventCategories.WorkspaceDetailPage,
              action: 'Launch Edit Workspace Dialog',
              label: name,
            }}
          >
            <EditIcon />
          </WorkspacesUpdateButton>
          <WorkspaceButton
            onClick={() => setDialogType('SHARE_WORKSPACE')}
            startIcon={<StyledSvgIcon as={ShareIcon} />}
          >
            Share
          </WorkspaceButton>
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

function SummaryBody({ workspace, creatorInfo }: { workspace: MergedWorkspace; creatorInfo?: WorkspaceUser }) {
  const { description, datetime_created, datetime_last_job_launch, datetime_last_modified } = workspace;

  return (
    <SectionPaper>
      <Stack spacing={2}>
        <LabelledSectionText label="Description">{description}</LabelledSectionText>
        <LabelledSectionText label="Created By">
          {creatorInfo ? (
            <Stack direction="row" alignItems="center">
              <Typography>
                {creatorInfo.first_name} {creatorInfo.last_name} |&nbsp;
              </Typography>
              <OutboundLink href={`mailto:${creatorInfo.email}`}>{creatorInfo.email}</OutboundLink>
              <TooltipButton
                href={`mailto:${creatorInfo.email}`}
                sx={{ minWidth: 0 }}
                tooltip={`Mail to ${creatorInfo.email}`}
              >
                <EmailIcon color="info" />
              </TooltipButton>
            </Stack>
          ) : (
            'Me'
          )}
        </LabelledSectionText>
        <Stack spacing={15} direction="row">
          <LabelledSectionText label="Creation Date">
            {format(new Date(datetime_created), 'yyyy-MM-dd')}
          </LabelledSectionText>
          {datetime_last_job_launch && (
            <LabelledSectionText label="Last Launched" iconTooltipText={tooltips.lastLaunched}>
              {format(new Date(datetime_last_job_launch), 'yyyy-MM-dd')}
            </LabelledSectionText>
          )}
          {datetime_last_modified && (
            <LabelledSectionText label="Last Modified" iconTooltipText={tooltips.lastModified}>
              {format(new Date(datetime_last_modified), 'yyyy-MM-dd')}
            </LabelledSectionText>
          )}
        </Stack>
        <RelevantPagesSection pages={pages} />
      </Stack>
    </SectionPaper>
  );
}

function Summary({
  workspace,
  creatorInfo,
  handleStopWorkspace,
  isStoppingWorkspace,
}: {
  workspace: MergedWorkspace;
  creatorInfo?: WorkspaceUser;
  handleStopWorkspace: (id: number) => Promise<void>;
  isStoppingWorkspace: boolean;
}) {
  return (
    <DetailPageSection id="summary">
      <Stack spacing={1}>
        <SummaryTitle
          workspace={workspace}
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
        />
        <SummaryBody workspace={workspace} creatorInfo={creatorInfo} />
      </Stack>
    </DetailPageSection>
  );
}

function WorkspacePage({ workspaceId }: WorkspacePageProps) {
  const { workspace, creatorInfo, isLoading, handleStopWorkspace, isStoppingWorkspace } = useInvitationWorkspaceDetails(
    { workspaceId },
  );

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
      <WorkspacesListDialogs selectedWorkspaceIds={new Set([workspaceId.toString()])} />
      <DetailLayout sections={shouldDisplaySection}>
        {/* <WorkspaceContent workspaceId={workspaceId} /> */}
        <Stack gap={6} sx={{ marginBottom: 5 }}>
          <WorkspaceSessionWarning workspaces={[workspace]} />
          <Summary
            workspace={workspace}
            creatorInfo={creatorInfo}
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
