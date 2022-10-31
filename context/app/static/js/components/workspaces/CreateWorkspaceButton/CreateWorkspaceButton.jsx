import React from 'react';
import Button from '@material-ui/core/Button';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import { AddIcon } from 'js/shared-styles/icons';
import DialogModal from 'js/shared-styles/DialogModal';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceButton({ handleCreateWorkspace }) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace(
    handleCreateWorkspace,
  );

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
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CreateWorkspaceInput control={control} name="name" errors={errors} />
              <input type="submit" id="create-workspace-input" hidden />
            </form>
          </>
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
