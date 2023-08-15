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
  selectedRowsErrors,
  protectedRows,
  ...rest
}) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });

  // eslint-disable-next-line no-underscore-dangle
  const protectedHubmapIds = protectedRows.map((row) => row._source.hubmap_id).join(', ');
  const { openSnackbar } = useSnackbarStore();
  const { deselectRow } = useSelectableTableStore();

  const removeProctedDatasets = () => {
    protectedRows.forEach((row) => {
      // eslint-disable-next-line no-underscore-dangle
      deselectRow(row._id);
    });

    openSnackbar('Protected datasets successfully removed from selection.');
  };

  return (
    <>
      <ButtonComponent
        onClick={() => {
          setDialogIsOpen(true);
        }}
        {...rest}
      />
      <DialogModal
        title="Launch New Workspace"
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        selectedRowsErrors={selectedRowsErrors}
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
                  // eslint-disable-next-line no-underscore-dangle
                  value={protectedHubmapIds}
                />
                {/* <Box> */}
                <Button variant="contained" color="primary" onClick={() => removeProctedDatasets()}>
                  Remove Protected Datasets ({protectedRows.length})
                </Button>
                {/* </Box> */}
              </Box>
            )}
            <WorkspaceField control={control} name="name" label="Name" errors={errors} />
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="create-workspace-form" disabled={selectedRowsErrors.length > 0}>
              Submit
            </Button>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceDialog;
