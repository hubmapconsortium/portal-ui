import React from 'react';
import format from 'date-fns/format';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';

import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { MergedWorkspace } from 'js/components/workspaces/types';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';
import { useWorkspaceDetail, useSessionWarning } from 'js/components/workspaces/hooks';
import { Alert } from 'js/shared-styles/alerts';
import WorkspaceLaunchStopButton from 'js/components/workspaces/WorkspaceLaunchStopButton';
import { Typography } from '@mui/material';

interface Props {
  workspaceId: number;
}

function getWorkspaceDatasetUUIDs(workspace: MergedWorkspace) {
  const symlinks = workspace?.workspace_details?.request_workspace_details?.symlinks ?? [];
  return symlinks.reduce<string[]>(
    (acc, symlink) => (symlink?.dataset_uuid ? [...acc, symlink.dataset_uuid] : acc),
    [],
  );
}

function useMatchingWorkspaceTemplates(workspace: MergedWorkspace) {
  const workspaceFiles = workspace?.workspace_details?.request_workspace_details?.files ?? [];
  const { templates } = useWorkspaceTemplates();

  const matchingTemplates = workspaceFiles.reduce((acc, fileName) => {
    const templateName = fileName.split('.').shift();
    if (templateName && templateName in templates) {
      return { ...acc, [templateName]: templates[templateName] };
    }
    return acc;
  }, {});

  return matchingTemplates;
}

function LaunchStopButton(props: ButtonProps) {
  return <Button {...props} variant="contained" />;
}

function WorkspacePage({ workspaceId }: Props) {
  const { workspace, isLoading, handleStopWorkspace, isStoppingWorkspace } = useWorkspaceDetail({ workspaceId });
  const workspaceTemplates = useMatchingWorkspaceTemplates(workspace);

  const sessionWarning = useSessionWarning([workspace]);

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const job = condenseJobs(workspace.jobs);
  const workspaceDatasetUUIDs = getWorkspaceDatasetUUIDs(workspace);

  return (
    <Stack gap={6}>
      {sessionWarning && <Alert severity="info">{sessionWarning}</Alert>}
      <div>
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
            <WorkspaceLaunchStopButton
              workspace={workspace}
              button={LaunchStopButton}
              handleStopWorkspace={handleStopWorkspace}
              isStoppingWorkspace={isStoppingWorkspace}
            />
          }
        >
          <Typography>
            <JobStatus job={job} />
          </Typography>
        </SummaryData>
        <SectionPaper>
          <LabelledSectionText label="Creation Date">
            {format(new Date(workspace.datetime_created), 'yyyy-MM-dd')}
          </LabelledSectionText>
        </SectionPaper>
      </div>
      {workspaceDatasetUUIDs.length > 0 && <WorkspaceDatasetsTable datasetsUUIDs={workspaceDatasetUUIDs} />}
      <TemplateGrid templates={workspaceTemplates} />
    </Stack>
  );
}

export default WorkspacePage;
