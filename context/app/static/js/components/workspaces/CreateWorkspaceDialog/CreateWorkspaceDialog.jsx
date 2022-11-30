import React from 'react';
import Button from '@material-ui/core/Button';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import DialogModal from 'js/shared-styles/DialogModal';

function CreateWorkspaceDialog({ dialogIsOpen, handleClose, handleSubmit, onSubmit, errors, control }) {
  return (
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
  );
}

export default CreateWorkspaceDialog;
