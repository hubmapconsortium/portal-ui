import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import DialogModal from 'js/shared-styles/DialogModal';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({
  handleCreateWorkspace,
  buttonComponent: ButtonComponent,
  defaultName,
  results,
  ...rest
}) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });
  const { selectedRows } = useStore();

  const containsProtectedDataset = results?.hits?.items?.some((item) => item?.fields?.mapped_status === 'Protected');

  // console.log('results', results)
  // console.log('containsProtectedDataset', containsProtectedDataset);

  let errorMessage;

  if (selectedRows.size > 10) {
    errorMessage = `You have selected ${selectedRows.size} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`;
  } else if (containsProtectedDataset) {
    errorMessage = 'You have selected a protected dataset. Please unselect the protected dataset.';
  } else {
    errorMessage = null;
  }

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
        content={
          <Box
            component="form"
            sx={{
              marginTop: 1,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <CreateWorkspaceInput control={control} name="name" errors={errors} />
            <input type="submit" id="create-workspace-input" hidden />
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <label htmlFor="create-workspace-input">
              <Button component="span">Submit</Button>
            </label>
          </>
        }
        errorMessage={errorMessage}
      />
    </>
  );
}

export default CreateWorkspaceDialog;
