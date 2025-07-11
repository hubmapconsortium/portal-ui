import React from 'react';
import { format } from 'date-fns/format';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ShareIcon from '@mui/icons-material/Share';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';

import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useInvitationWorkspaceDetails } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import { AddIcon, EditIcon } from 'js/shared-styles/icons';
import WorkspacesUpdateButton from 'js/components/workspaces/WorkspacesUpdateButton';
import {
  MergedWorkspace,
  TemplatesTypes,
  WorkspaceCreatorInfo,
  WorkspaceInvitation,
  WorkspacesEventCategories,
} from 'js/components/workspaces/types';
import { buildSearchLink } from 'js/components/search/store';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { CollapsibleDetailPageSection, DetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { StyledSvgIcon } from 'js/components/workspaces/style';
import { WorkspaceButton } from 'js/components/workspaces/WorkspaceButton';
import WorkspacesListDialogs from 'js/components/workspaces/WorkspacesListDialogs';
import Description from 'js/shared-styles/sections/Description';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import InvitationTabs from 'js/components/workspaces/InvitationTabs';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';
import NameAndEmailLink from 'js/shared-styles/Links/NameAndEmailLink';
import { WorkspacesEventContextProvider, useWorkspacesEventContext } from 'js/components/workspaces/contexts';
import WorkspacesDeleteButton from 'js/components/workspaces/WorkspacesDeleteButton';
import { trackEvent } from 'js/helpers/trackers';
import NonLinkingCreatorInfo from 'js/shared-styles/Links/NonLinkingCreatorInfo';
import WorkspaceDetailAuthGuard from 'js/components/workspaces/WorkspaceDetailAuthGuard';

const tooltips = {
  delete: 'Delete this workspace. This action is permanent.',
  update: 'Edit workspace name or description',
  lastLaunched: 'Date of the last launched session',
  lastModified: 'Date of the last modification to the content of the workspace',
  templates: 'Add templates to this workspace',
  currentTemplates: 'Templates that are currently in this workspace',
};

const descriptions = {
  sentInvitationsAbsent:
    'You have no sent invitations for this workspace. To share a copy of this workspace, click the share button. This is not a synchronous sharing feature, so the recipients will receive a copy of the workspace at its current version.',
  sentInvitationsPresent:
    'View the status of invitations you have sent for this workspace. You can cancel pending invitations, but canceling pending invitations will prevent the recipient from accepting. This is not a synchronous sharing feature, so recipients will receive a copy of the workspace at the version sent at the shared date. ',
  datasetsAbsent:
    'There are no datasets in this workspace. Navigate to the dataset search page to find and add datasets to your workspace.',
  datasetsPresent:
    'These are the datasets included in this workspace. You can add more datasets by navigating to the search page or by using the add button to input datasets via HuBMAP IDs.',
  templates:
    'These are the templates that are in this workspace. You can add more templates to this workspace by using the add button.',
};

const trackRelevantPage = (pageName: string, workspaceName: string) => {
  trackEvent({
    category: WorkspacesEventCategories.WorkspaceDetailPage,
    action: 'Select Relevant Page Button',
    label: `${workspaceName} ${pageName}`,
  });
};

const datasetsPage = (workspaceName: string) => ({
  link: buildSearchLink({
    entity_type: 'Dataset',
  }),
  children: 'Dataset Search Page',
  onClick: () => trackRelevantPage('Dataset Search Page', workspaceName),
});

const pages = (workspaceName: string) => [
  {
    link: '/workspaces',
    children: 'My Workspaces',
    onClick: () => trackRelevantPage('My Workspaces', workspaceName),
  },
  datasetsPage(workspaceName),
];

const shouldDisplaySection = {
  summary: true,
  'sent-invitations-status': true,
  datasets: true,
  templates: true,
};

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
      otherButtons={
        <Stack direction="row" alignItems="center" spacing={1}>
          <WorkspacesDeleteButton workspaceIds={new Set([workspace.id.toString()])} tooltip={tooltips.delete} />
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

function SummaryBody({ workspace, creatorInfo }: { workspace: MergedWorkspace; creatorInfo: WorkspaceCreatorInfo }) {
  const { description, datetime_created, datetime_last_job_launch, datetime_last_modified } = workspace;

  return (
    <SectionPaper>
      <Stack spacing={2}>
        {description && <LabelledSectionText label="Description">{description}</LabelledSectionText>}
        <LabelledSectionText label="Created By">
          {typeof creatorInfo === 'string' ? (
            <NonLinkingCreatorInfo creatorInfo={creatorInfo} />
          ) : (
            <NameAndEmailLink
              first_name={creatorInfo.first_name}
              last_name={creatorInfo.last_name}
              email={creatorInfo.email}
            />
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
        <RelevantPagesSection pages={pages(workspace.name)} />
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
  creatorInfo: WorkspaceCreatorInfo;
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

function SentInvitationsStatus({ sentInvitations }: { sentInvitations: WorkspaceInvitation[] }) {
  const { setDialogType } = useEditWorkspaceStore();
  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();

  return (
    <CollapsibleDetailPageSection
      id="sent-invitations-status"
      title="Sent Invitations Status"
      icon={sectionIconMap['sent-invitations-status']}
      trackingInfo={{
        category: currentEventCategory,
        label: `${currentWorkspaceItemId} Sent Invitations Status`,
      }}
    >
      {sentInvitations.length === 0 ? (
        <Description>
          <Stack spacing={1}>
            <Typography>{descriptions.sentInvitationsAbsent}</Typography>
            <Box>
              <Button
                onClick={() => setDialogType('SHARE_WORKSPACE')}
                startIcon={<StyledSvgIcon as={ShareIcon} />}
                variant="contained"
              >
                Share
              </Button>
            </Box>
          </Stack>
        </Description>
      ) : (
        <Stack spacing={1}>
          <SectionDescription>{descriptions.sentInvitationsPresent}</SectionDescription>
          <InvitationTabs sentInvitations={sentInvitations} />
        </Stack>
      )}
    </CollapsibleDetailPageSection>
  );
}

function Datasets({ workspace, workspaceDatasets }: { workspace: MergedWorkspace; workspaceDatasets: string[] }) {
  const { currentEventCategory, currentWorkspaceItemName, currentWorkspaceItemId } = useWorkspacesEventContext();

  return (
    <CollapsibleDetailPageSection
      id="datasets"
      title="Datasets"
      icon={sectionIconMap.datasets}
      trackingInfo={{
        category: currentEventCategory,
        label: `${currentWorkspaceItemId} Datasets`,
      }}
    >
      <Stack spacing={1}>
        <SectionDescription>
          <Stack spacing={1}>
            <Typography>
              {workspaceDatasets.length > 0 ? descriptions.datasetsPresent : descriptions.datasetsAbsent}
            </Typography>
            <Box>
              <OutlinedLinkButton key={datasetsPage(workspace.name).link} {...datasetsPage(workspace.name)} />
            </Box>
          </Stack>
        </SectionDescription>
        <WorkspaceDatasetsTable
          datasetsUUIDs={workspaceDatasets}
          hideTableIfEmpty
          addDatasets={workspace}
          copyDatasets
          trackingInfo={{
            category: currentEventCategory,
            label: currentWorkspaceItemName,
          }}
        />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

function Templates({
  workspace,
  workspaceTemplates,
}: {
  workspace: MergedWorkspace;
  workspaceTemplates: TemplatesTypes;
}) {
  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();

  return (
    <CollapsibleDetailPageSection
      id="templates"
      title="Templates"
      icon={sectionIconMap.templates}
      action={
        <WorkspacesUpdateButton workspace={workspace} dialogType="UPDATE_TEMPLATES" tooltip={tooltips.templates}>
          <AddIcon />
        </WorkspacesUpdateButton>
      }
      trackingInfo={{
        category: currentEventCategory,
        label: `${currentWorkspaceItemId} Templates`,
      }}
    >
      <Stack>
        <SectionDescription>{descriptions.templates}</SectionDescription>
        <TemplateGrid templates={workspaceTemplates} />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

function WorkspacePageContent({ workspaceId }: WorkspacePageProps) {
  const {
    workspace,
    creatorInfo,
    workspaceSentInvitations,
    workspaceDatasets,
    workspaceTemplates,
    isLoading,
    isStoppingWorkspace,
    handleStopWorkspace,
  } = useInvitationWorkspaceDetails({ workspaceId });

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  return (
    <WorkspacesEventContextProvider
      currentEventCategory={WorkspacesEventCategories.WorkspaceDetailPage}
      currentWorkspaceItemId={workspaceId}
      currentWorkspaceItemName={workspace.name}
    >
      <WorkspacesListDialogs selectedWorkspaceIds={new Set([workspaceId.toString()])} />
      <DetailLayout
        sections={shouldDisplaySection}
        trackingInfo={{ category: WorkspacesEventCategories.WorkspaceDetailPage, label: workspace.name }}
      >
        <Stack gap={1} sx={{ marginBottom: 5 }}>
          <WorkspaceSessionWarning workspace={workspace} />
          <Summary
            workspace={workspace}
            creatorInfo={creatorInfo}
            handleStopWorkspace={handleStopWorkspace}
            isStoppingWorkspace={isStoppingWorkspace}
          />
          <SentInvitationsStatus sentInvitations={workspaceSentInvitations} />
          <Datasets workspace={workspace} workspaceDatasets={workspaceDatasets} />
          <Templates workspace={workspace} workspaceTemplates={workspaceTemplates} />
        </Stack>
      </DetailLayout>
    </WorkspacesEventContextProvider>
  );
}

function WorkspacePage({ workspaceId }: WorkspacePageProps) {
  return (
    <WorkspaceDetailAuthGuard>
      <WorkspacePageContent workspaceId={workspaceId} />
    </WorkspaceDetailAuthGuard>
  );
}

export default WorkspacePage;
