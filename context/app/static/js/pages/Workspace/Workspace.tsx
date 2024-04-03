import React from 'react';
import format from 'date-fns/format';
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
          showJsonButton={false}
          entityCanBeSaved={false}
          entityTypeDisplay={undefined}
          uuid=""
          status=""
          mapped_data_access_level=""
          otherButtons={
            <>
              <WorkspacesUpdateButton
                workspace={workspace}
                dialogType="UPDATE_NAME"
                sx={(theme) => ({
                  marginRight: theme.spacing(1),
                })}
              >
                <EditIcon />
              </WorkspacesUpdateButton>
              <WorkspaceLaunchStopButtons
                workspace={workspace}
                button={LaunchStopButton}
                handleStopWorkspace={handleStopWorkspace}
                isStoppingWorkspace={isStoppingWorkspace}
              />
            </>
          }
        >
          <Typography variant="subtitle1" component="p">
            <JobStatus job={job} />
          </Typography>
        </SummaryData>
        <SectionPaper>
          <LabelledSectionText label="Creation Date">
            {format(new Date(workspace.datetime_created), 'yyyy-MM-dd')}
          </LabelledSectionText>
        </SectionPaper>
      </Box>
      {workspaceDatasets.length > 0 && (
        <WorkspaceDatasetsTable
          datasetsUUIDs={workspaceDatasets}
          label={<SectionHeader> Datasets</SectionHeader>}
          additionalButtons={
            <WorkspacesUpdateButton
              workspace={workspace}
              dialogType="ADD_DATASETS"
              sx={(theme) => ({
                marginRight: theme.spacing(1),
              })}
            >
              <AddIcon />
            </WorkspacesUpdateButton>
          }
        />
      )}
      <Box>
        <SpacedSectionButtonRow
          leftText={
            <SectionHeader iconTooltipText="Templates that are currently in this workspace."> Templates</SectionHeader>
          }
          buttons={
            <WorkspacesUpdateButton workspace={workspace} dialogType="UPDATE_TEMPLATES">
              <AddIcon />
            </WorkspacesUpdateButton>
          }
        />
        <TemplateGrid templates={workspaceTemplates} />
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
