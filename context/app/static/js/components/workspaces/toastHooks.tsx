import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

type idType = string | number;

export const useWorkspaceToasts = () => {
  const { toastError, toastSuccess } = useSnackbarActions();

  /** **********************************
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

  /** *********************************
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
