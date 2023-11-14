import React from 'react';
import { useWorkspace } from 'js/components/workspaces/api';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { type Workspace } from 'js/components/workspaces/types';

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

function WorkspacePage({ workspaceId }: Props) {
  const { workspace, isLoading } = useWorkspace(workspaceId);

  if (isLoading || Object.keys(workspace).length === 0) {
    return null;
  }

  const workspaceDatasetUUIDs = getWorkspaceDatasetUUIDs(workspace);
  return workspaceDatasetUUIDs.length > 0 && <WorkspaceDatasetsTable datasetsUUIDs={workspaceDatasetUUIDs} />;
}

export default WorkspacePage;
