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
  errorMessages,
  ...rest
}) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });

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
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button component="span" disabled={errorMessages.length > 0}>
              Submit
            </Button>
          </>
        }
        errorMessages={errorMessages}
      />
    </>
  );
}

export default CreateWorkspaceDialog;
