import React from 'react';
import { Alert } from 'js/shared-styles/alerts';
import Button from '@mui/material/Button';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useRefreshSession, useSessionWarning, useWorkspacesList } from './hooks';
import { MergedWorkspace } from './types';

interface RefreshSessionProps {
  workspace: MergedWorkspace;
}

function RefreshSession({ workspace }: RefreshSessionProps) {
  const { refreshSession, isRefreshingSession } = useRefreshSession(workspace);

  const { toastError } = useSnackbarActions();

  const handleClick = () => {
    refreshSession().catch((err: Error) => {
      toastError(`${err.name} - ${err.message}`);
    });
  };
  return (
    <Button onClick={handleClick} disabled={isRefreshingSession}>
      Renew Session Time
    </Button>
  );
}

interface WorkspaceSessionWarningProps {
  workspaces?: MergedWorkspace[];
}
export default function WorkspaceSessionWarning({ workspaces }: WorkspaceSessionWarningProps) {
  const { workspacesList } = useWorkspacesList();
  const sessionWarning = useSessionWarning(workspaces ?? workspacesList);

  if (!sessionWarning) return null;

  const { warning, matchedWorkspace } = sessionWarning;

  return (
    <Alert severity="info" action={<RefreshSession workspace={matchedWorkspace} />}>
      {warning}
    </Alert>
  );
}
