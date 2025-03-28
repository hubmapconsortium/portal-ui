import React from 'react';
import Button from '@mui/material/Button';
import { Alert } from 'js/shared-styles/alerts';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { InternalLink } from 'js/shared-styles/Links';
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
  link?: boolean;
}
export default function WorkspaceSessionWarning({ workspaces, link }: WorkspaceSessionWarningProps) {
  const { workspacesList } = useWorkspacesList();
  const sessionWarning = useSessionWarning(workspaces ?? workspacesList);

  if (!sessionWarning) return null;

  const { warning, matchedWorkspace } = sessionWarning;

  const formattedWorkspaceName = link ? (
    <InternalLink href={`/workspaces/${matchedWorkspace.id}`}>{matchedWorkspace.name}</InternalLink>
  ) : (
    matchedWorkspace.name
  );

  return (
    <Alert severity="info" action={<RefreshSession workspace={matchedWorkspace} />}>
      {formattedWorkspaceName} {warning}
    </Alert>
  );
}
