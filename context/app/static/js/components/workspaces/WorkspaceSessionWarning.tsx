import React from 'react';
import Button from '@mui/material/Button';
import { CenteredAlert } from 'js/components/style';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { InternalLink } from 'js/shared-styles/Links';
import { generateCommaList } from 'js/helpers/functions';
import { useRefreshSessions, useRunningWorkspaces, useSessionWarning } from './hooks';
import { MergedWorkspace } from './types';

interface RefreshSessionProps {
  workspaces: MergedWorkspace[];
}

function RefreshSession({ workspaces }: RefreshSessionProps) {
  const { refreshSessions, isRefreshingSessions } = useRefreshSessions(workspaces);

  const { toastError } = useSnackbarActions();

  const handleClick = () => {
    refreshSessions().catch((err: Error) => {
      toastError(`${err.name} - ${err.message}`);
    });
  };
  return (
    <Button onClick={handleClick} disabled={isRefreshingSessions}>
      {workspaces.length > 1 ? 'Renew All Session Times' : 'Renew Session Time'}
    </Button>
  );
}

interface WorkspaceSessionWarningProps {
  link?: boolean;
  workspace?: MergedWorkspace;
}
export default function WorkspaceSessionWarning({ link, workspace }: WorkspaceSessionWarningProps) {
  const runningWorkspaces = useRunningWorkspaces();
  // If a specific workspace is provided (ie, for a detail page), only use that one; otherwise, use all running workspaces.
  const workspaces = workspace ? [workspace] : runningWorkspaces;

  const sessionWarning = useSessionWarning(workspaces);

  if (!sessionWarning) return null;

  const formattedWorkspaceNames = generateCommaList(
    workspaces.map((ws) =>
      link ? (
        <InternalLink key={ws.id} href={`/workspaces/${ws.id}`}>
          {ws.name}
        </InternalLink>
      ) : (
        <span key={ws.id}>{ws.name}</span>
      ),
    ),
  );

  return (
    <CenteredAlert severity="info" action={<RefreshSession workspaces={workspaces} />}>
      {formattedWorkspaceNames} {sessionWarning}
    </CenteredAlert>
  );
}
