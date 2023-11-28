import React from 'react';
import format from 'date-fns/format';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';

import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { MergedWorkspace } from 'js/components/workspaces/types';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs, getWorkspaceFileName } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useWorkspaceDetail } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';
import { useEditWorkspaceNameStore } from 'js/components/workspaces/EditWorkspaceNameDialog/store';
import { EditIcon } from 'js/shared-styles/icons';
import WorkspacesUpdateButton from 'js/components/workspaces/WorkspacesUpdateButton';

interface WorkspacePageProps {
  workspaceId: number;
}

function getWorkspaceDatasetUUIDs(workspace: MergedWorkspace) {
  // TODO: Use current_workspace_details once data inconsistencies are resolved.
  const symlinks = workspace?.workspace_details?.request_workspace_details?.symlinks ?? [];
  return symlinks.reduce<string[]>(
    (acc, symlink) => (symlink?.dataset_uuid ? [...acc, symlink.dataset_uuid] : acc),
    [],
  );
}

function useMatchingWorkspaceTemplates(workspace: MergedWorkspace) {
  // TODO: Use current_workspace_details once data inconsistencies are resolved.
  const workspaceFiles = workspace?.workspace_details?.request_workspace_details?.files ?? [];
  const { templates } = useWorkspaceTemplates();

  const matchingTemplates = workspaceFiles.reduce((acc, file) => {
    const templateName = getWorkspaceFileName(file).split('.').shift();
    if (templateName && templateName in templates) {
      return { ...acc, [templateName]: templates[templateName] };
    }
    return acc;
  }, {});

  return matchingTemplates;
}

function LaunchStopButton(props: ButtonProps) {
  const variant = props?.children?.toString() === 'Stop Jobs' ? 'outlined' : 'contained';
  return <Button {...props} variant={variant} />;
}

function UpdateNameButton({ workspace }: { workspace: MergedWorkspace }) {
  const { open, setWorkspace } = useEditWorkspaceNameStore();
  return (
    <WorkspacesUpdateButton
      workspace={workspace}
      onClick={() => {
        setWorkspace(workspace);
        open();
      }}
      sx={(theme) => ({
        marginRight: theme.spacing(1),
      })}
    >
      <EditIcon sx={{ fontSize: '1.25rem' }} />
    </WorkspacesUpdateButton>
  );
}

function WorkspaceContent({ workspaceId }: WorkspacePageProps) {
  const { workspace, isLoading, handleStopWorkspace, isStoppingWorkspace } = useWorkspaceDetail({ workspaceId });
  const workspaceTemplates = useMatchingWorkspaceTemplates(workspace);

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const job = condenseJobs(workspace.jobs);
  const workspaceDatasetUUIDs = getWorkspaceDatasetUUIDs(workspace);

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
              <UpdateNameButton workspace={workspace} />
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
      {workspaceDatasetUUIDs.length > 0 && (
        <WorkspaceDatasetsTable
          datasetsUUIDs={workspaceDatasetUUIDs}
          label={<SectionHeader> Datasets</SectionHeader>}
        />
      )}
      <Box>
        <SpacedSectionButtonRow
          leftText={
            <SectionHeader iconTooltipText="Templates that are currently in this workspace."> Templates</SectionHeader>
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
