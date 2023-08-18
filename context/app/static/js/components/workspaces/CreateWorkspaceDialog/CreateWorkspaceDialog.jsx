import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import DialogModal from 'js/shared-styles/DialogModal';
import { useSnackbarStore } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({
  handleCreateWorkspace,
  buttonComponent: ButtonComponent,
  defaultName,
  errorMessages,
  protectedRows,
  ...rest
}) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });

  const protectedHubmapIds = protectedRows?.map((row) => row._source.hubmap_id).join(', ');
  const { toastSuccess } = useSnackbarStore();
  const { deselectRows } = useSelectableTableStore();

  const removeProtectedDatasets = () => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccess('Protected datasets successfully removed from selection.');
  };

  return (
    <>
      <ButtonComponent
        onClick={() => {
          setDialogIsOpen(true);
          rest?.onClick?.();
        }}
        {...rest}
      />
      <DialogModal
        title="Launch New Workspace"
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        errorMessages={errorMessages}
        protectedRows={protectedRows}
        content={
          <Box
            id="create-workspace-form"
            component="form"
            sx={{
              display: 'grid',
              gap: 2,
              marginTop: 1,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {protectedHubmapIds.length > 0 && (
              <Box>
                <WorkspaceField
                  control={control}
                  name="Protected Datasets"
                  errors={errors}
                  value={protectedHubmapIds}
                />
                <Button sx={{ marginTop: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
                  Remove Protected Datasets ({protectedRows.length})
                </Button>
              </Box>
            )}
            <WorkspaceField
              control={control}
              name="workspace-name"
              disabled={errorMessages.length > 0}
              label="Name"
              errors={errors}
              autoFocus
            />
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="create-workspace-form" disabled={errorMessages.length > 0}>
              Launch
            </Button>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceDialog;
