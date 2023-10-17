import React from 'react';

import { PanelWrapper } from 'js/shared-styles/panels';

import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import Button from '@mui/material/Button';

import { useWorkspacesList } from './hooks';
import { MergedWorkspace } from './types';

interface WorkspaceListItemProps {
  workspace: MergedWorkspace;
}

// TODO: Convert the actual hook to TS
interface UseWorkspacesList {
  handleStartWorkspace: (workspaceId: number) => Promise<void>;
  handleDeleteWorkspace: (workspaceId: number) => Promise<void>;
  handleStopWorkspace: (workspaceId: number) => Promise<void>;
}

function WorkspaceListItemButtons({ workspace }: WorkspaceListItemProps) {
  const { handleStartWorkspace, handleStopWorkspace } = useWorkspacesList() as UseWorkspacesList;
  const { toastError } = useSnackbarActions();
  if (workspace.status === 'deleting') {
    return (
      <Button type="button" disabled variant="elevated" size="small">
        Deleting...
      </Button>
    );
  }
  if (workspace.jobs.length > 0) {
    return (
      <Button
        type="button"
        variant="elevated"
        size="small"
        disabled={workspace.jobs.length === 0}
        sx={{ height: '32px' }}
        onClick={() => {
          handleStopWorkspace(workspace.id).catch((err) => {
            toastError(`Error stopping ${workspace.name}.`);
            console.error(err);
          });
        }}
      >
        Stop Jobs
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="elevated"
      size="small"
      sx={{ height: '32px' }}
      onClick={() => {
        handleStartWorkspace(workspace.id).catch((err) => {
          toastError(`Error starting ${workspace.name}.`);
          console.error(err);
        });
      }}
    >
      Launch Workspace
    </Button>
  );
}

function WorkspaceListItem({ workspace }: WorkspaceListItemProps) {
  const { handleStartWorkspace } = useWorkspacesList() as UseWorkspacesList;
  return (
    <PanelWrapper key={workspace.id}>
      <WorkspaceDetails workspace={workspace} handleStartWorkspace={handleStartWorkspace} />
      <WorkspaceListItemButtons workspace={workspace} />
    </PanelWrapper>
  );
}

export default WorkspaceListItem;
