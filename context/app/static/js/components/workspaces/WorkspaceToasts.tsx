import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/** ********************************
 *           Error Toasts         *
 ********************************* */

function WorkspacesDeleteErrorToast(names: string) {
  return `Error deleting workspaces: ${names}`;
}

function WorkspaceUpdateErrorToast() {
  return 'Failed to update workspace.';
}

function WorkspaceStopErrorToast(workspaceName?: string) {
  return `Failed to stop ${workspaceName ?? 'workspace'}. Please try again.`;
}

function WorkspaceLaunchErrorToast() {
  return 'Failed to launch workspace. Please try again.';
}

function WorkspaceCreateErrorToast() {
  return 'Failed to create workspace.';
}

function WorkspaceTemplateErrorToast(templateTitle?: string) {
  return `There are issues with creating ${templateTitle ?? 'the selected template'}. Failed to create workspace.`;
}

/** ********************************
 *          Success Toasts        *
 ********************************* */

type idType = string | number;

function SessionRenewSuccessToast() {
  return 'Session time for workspace successfully renewed.';
}

function ProtectedDatasetsRemoveSuccessToast() {
  return 'Protected datasets successfully removed from selection.';
}

function WorkspaceUpdateSuccessToast() {
  return 'Workspace successfully updated.';
}

function WorkspaceCreateSuccessToast() {
  return 'Workspace successfully created.';
}

function WorkspacesDeleteSuccessToast(names: string) {
  return `Successfully deleted workspaces: ${names}`;
}

function DatasetAddSuccessToast(id: idType) {
  return `${id} successfully added.`;
}

function WorkspaceLaunchSuccessToast(id: idType) {
  return (
    <Stack spacing={1} maxWidth="22rem">
      <Typography>
        Workspace successfully launched in a new tab. If the tab didn&apos;t open, please check your pop-up blocker
        settings and relaunch your workspace.
      </Typography>
      <Button href={`/workspaces/${id}`} variant="text" color="inherit" sx={{ alignSelf: 'flex-end' }}>
        View Workspace Detail Page
      </Button>
    </Stack>
  );
}

export {
  WorkspaceLaunchSuccessToast,
  WorkspaceCreateSuccessToast,
  DatasetAddSuccessToast,
  WorkspacesDeleteSuccessToast,
  WorkspaceUpdateSuccessToast,
  ProtectedDatasetsRemoveSuccessToast,
  SessionRenewSuccessToast,
  WorkspacesDeleteErrorToast,
  WorkspaceUpdateErrorToast,
  WorkspaceStopErrorToast,
  WorkspaceLaunchErrorToast,
  WorkspaceTemplateErrorToast,
  WorkspaceCreateErrorToast,
};
