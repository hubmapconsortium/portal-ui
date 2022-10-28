import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import { AddIcon } from 'js/shared-styles/icons';
import DialogModal from 'js/shared-styles/DialogModal';

function CreateWorkspaceButton({ handleCreateWorkspace }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      workspaceName: '',
    },
    mode: 'onChange',
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit({ workspaceName }) {
    handleCreateWorkspace({ workspaceName });
    reset();
    handleClose();
  }
  return (
    <>
      <Button onClick={() => setDialogIsOpen(true)}>
        <AddIcon color="primary" />
      </Button>
      <DialogModal
        title="Create New Workspace"
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <CreateWorkspaceInput control={control} name="workspaceName" />
            <input type="submit" id="create-workspace-input" hidden />
          </form>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <label htmlFor="create-workspace-input">
              <Button component="span">Save</Button>
            </label>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceButton;
