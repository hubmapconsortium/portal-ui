import React, { ReactNode, useCallback } from 'react';
import { create } from 'zustand';

import { Button, Stack, Typography } from '@mui/material';
import { Severity, SnackbarMessage } from './types';

interface SnackbarProviderState {
  message?: SnackbarMessage;
  snackbarOpen: boolean;
  openSnackbar: (newMessage: ReactNode, severity?: Severity, key?: string | number) => void;
  closeSnackbar: () => void;
  toastInfo: (message: ReactNode, key?: string | number) => void;
  toastSuccess: (message: ReactNode, key?: string | number) => void;
  toastWarning: (message: ReactNode, key?: string | number) => void;
  toastError: (message: ReactNode, key?: string | number) => void;
}

const formatMessage = (
  newMessage: ReactNode,
  severity: Severity = 'info',
  key: string | number = new Date().getTime(),
) => {
  const message: SnackbarMessage = {
    message: newMessage,
    severity,
    key,
  };
  return message;
};

const useStore = create<SnackbarProviderState>((set, get) => ({
  message: undefined,
  snackbarOpen: false,
  openSnackbar: (newMessage, severity = 'info', key = new Date().getTime()) => {
    set({
      snackbarOpen: true,
      message: formatMessage(newMessage, severity, key),
    });
  },
  closeSnackbar: () => {
    set({
      snackbarOpen: false,
      message: undefined,
    });
  },
  toastInfo: (message, key) => get().openSnackbar(message, 'info', key),
  toastSuccess: (message, key) => get().openSnackbar(message, 'success', key),
  toastError: (message, key) => get().openSnackbar(message, 'error', key),
  toastWarning: (message, key) => get().openSnackbar(message, 'warning', key),
}));

type idType = string | number;

const useSnackbarActions = () => {
  const { toastError, toastInfo, toastWarning, toastSuccess, closeSnackbar } = useStore((store) => ({
    toastError: store.toastError,
    toastInfo: store.toastInfo,
    toastWarning: store.toastWarning,
    toastSuccess: store.toastSuccess,
    closeSnackbar: store.closeSnackbar,
  }));

  /** *********************************
   *           Error Toasts           *
   ********************************** */

  const toastErrorDeleteWorkspaces = useCallback(
    (names: string) => toastError(`Error deleting workspaces: ${names}`),
    [toastError],
  );

  const toastErrorUpdateWorkspace = useCallback(() => toastError('Failed to update workspace.'), [toastError]);

  const toastErrorStopWorkspace = useCallback(
    (workspaceName?: string) => toastError(`Failed to stop ${workspaceName ?? 'workspace'}. Please try again.`),
    [toastError],
  );

  const toastErrorLaunchWorkspace = useCallback(
    () => toastError('Failed to launch workspace. Please try again.'),
    [toastError],
  );

  const toastErrorCreateWorkspace = useCallback(() => toastError('Failed to create workspace.'), [toastError]);

  const toastErrorWorkspaceTemplate = useCallback(
    (templateTitle?: string) =>
      toastError(
        `There are issues with creating ${templateTitle ?? 'the selected template'}. Failed to create workspace.`,
      ),
    [toastError],
  );

  /** ********************************
   *          Success Toasts         *
   ********************************* */

  const toastSuccessRenewSession = useCallback(
    () => toastSuccess('Session time for workspace successfully renewed.'),
    [toastSuccess],
  );

  const toastSuccessRemoveProtectedDatasets = useCallback(
    () => toastSuccess('Protected datasets successfully removed from selection.'),
    [toastSuccess],
  );

  const toastSuccessUpdateWorkspace = useCallback(
    () => toastSuccess('Workspace successfully updated.'),
    [toastSuccess],
  );

  const toastSuccessCreateWorkspace = useCallback(
    () => toastSuccess('Workspace successfully created.'),
    [toastSuccess],
  );

  const toastSuccessDeleteWorkspaces = useCallback(
    (names: string) => toastSuccess(`Successfully deleted workspaces: ${names}`),
    [toastSuccess],
  );

  const toastSuccessAddDataset = useCallback((id: idType) => toastSuccess(`${id} successfully added.`), [toastSuccess]);

  const toastSuccessLaunchWorkspace = useCallback(
    (id: idType) =>
      toastSuccess(
        <Stack spacing={1} maxWidth="22rem">
          <Typography>
            Workspace successfully launched in a new tab. If the tab didn&apos;t open, please check your pop-up blocker
            settings and relaunch your workspace.
          </Typography>
          <Button href={`/workspaces/${id}`} variant="text" color="inherit" sx={{ alignSelf: 'flex-end' }}>
            View Workspace Detail Page
          </Button>
        </Stack>,
      ),
    [toastSuccess],
  );

  return {
    toastError,
    toastInfo,
    toastWarning,
    toastSuccess,
    closeSnackbar,
    toastErrorDeleteWorkspaces,
    toastErrorUpdateWorkspace,
    toastErrorStopWorkspace,
    toastErrorLaunchWorkspace,
    toastErrorCreateWorkspace,
    toastErrorWorkspaceTemplate,
    toastSuccessRenewSession,
    toastSuccessRemoveProtectedDatasets,
    toastSuccessUpdateWorkspace,
    toastSuccessCreateWorkspace,
    toastSuccessDeleteWorkspaces,
    toastSuccessAddDataset,
    toastSuccessLaunchWorkspace,
  };
};

export { useStore as useSnackbarStore, useSnackbarActions };
