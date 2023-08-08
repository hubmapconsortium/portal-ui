import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import DialogModal from 'js/shared-styles/DialogModal';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({
  handleCreateWorkspace,
  buttonComponent: ButtonComponent,
  defaultName,
  errorMessage,
  ...rest
}) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });

  return (
    <>
      <ButtonComponent onClick={() => setDialogIsOpen(true)} {...rest} />
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
