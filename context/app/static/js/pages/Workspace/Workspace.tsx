import React from 'react';
import { useWorkspace } from 'js/components/workspaces/api';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { type Workspace } from 'js/components/workspaces/types';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';

interface Props {
  workspaceId: number;
}

function getWorkspaceDatasetUUIDs(workspace: Workspace) {
  const symlinks = workspace?.workspace_details?.request_workspace_details?.symlinks ?? [];
  return symlinks.reduce<string[]>(
    (acc, symlink) => (symlink?.dataset_uuid ? [...acc, symlink.dataset_uuid] : acc),
    [],
  );
}

function useMatchingWorkspaceTemplates(workspace: Workspace) {
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

function WorkspacePage({ workspaceId }: Props) {
  const { workspace, isLoading } = useWorkspace(workspaceId);
  const workspaceTemplates = useMatchingWorkspaceTemplates(workspace);

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const workspaceDatasetUUIDs = getWorkspaceDatasetUUIDs(workspace);
  return (
    <>
      {workspaceDatasetUUIDs.length > 0 && <WorkspaceDatasetsTable datasetsUUIDs={workspaceDatasetUUIDs} />}{' '}
      <TemplateGrid templates={workspaceTemplates} />
    </>
  );
}

export default WorkspacePage;
