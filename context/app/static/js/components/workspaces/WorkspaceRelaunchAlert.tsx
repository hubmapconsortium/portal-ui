import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { CloseIcon } from 'js/shared-styles/icons';
import { Alert } from 'js/shared-styles/alerts';
import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceDetail, useWorkspacesList } from './hooks';

function getFailedWorkspaceID() {
  const failedWorkspaceID = new URLSearchParams(document.location.search).get('failed_workspace_id');
  if (failedWorkspaceID) {
    return parseInt(failedWorkspaceID, 10);
  }

  return null;
}

function WorkspaceRelaunchAlert({ workspaceId }: { workspaceId: number }) {
  const { workspace } = useWorkspaceDetail({ workspaceId });
  const { open, setWorkspace } = useLaunchWorkspaceStore();
  const [showAlert, setShowAlert] = useState(true);

  const openLaunch = useCallback(() => {
    setWorkspace(workspace);
    open();
  }, [open, setWorkspace, workspace]);

  const closeAlert = useCallback(() => {
    setShowAlert(false);
  }, [setShowAlert]);

  if (!showAlert) {
    return null;
  }
  return (
    <Alert
      severity="error"
      action={
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button onClick={openLaunch}>Relaunch</Button>
          <IconButton onClick={closeAlert} sx={(theme) => ({ color: theme.palette.text.primary })}>
            <CloseIcon />
          </IconButton>
        </Stack>
      }
    >
      Your workspace at this time cannot be launched due to high demand. Please try again later.
    </Alert>
  );
}

function WorkspaceRelaunchAlertWrapper() {
  const failedWorkspaceID = getFailedWorkspaceID();
  const { workspacesList } = useWorkspacesList();

  const workspaceIDSet = new Set(Object.values(workspacesList).map(({ id }) => id));

  if (failedWorkspaceID && workspaceIDSet.has(failedWorkspaceID)) {
    return <WorkspaceRelaunchAlert workspaceId={failedWorkspaceID} />;
  }

  return null;
}

export default WorkspaceRelaunchAlertWrapper;
