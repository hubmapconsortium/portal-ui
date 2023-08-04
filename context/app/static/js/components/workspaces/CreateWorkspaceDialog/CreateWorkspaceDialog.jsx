import React from 'react';
import Button from '@mui/material/Button';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import DialogModal from 'js/shared-styles/DialogModal';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({ handleCreateWorkspace, buttonComponent: ButtonComponent, defaultName, ...rest }) {
  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    handleCreateWorkspace,
    defaultName,
  });

  return (
    <>
      <ButtonComponent onClick={() => setDialogIsOpen(true)} {...rest} />
      <DialogModal
        title="Launch New Workspace"
        // title={`Launch New Workspace: `}
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <br />
            <CreateWorkspaceInput control={control} name="name" errors={errors} />
            <input type="submit" id="create-workspace-input" hidden />
          </form>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <label htmlFor="create-workspace-input">
              <Button component="span">Submit</Button>
            </label>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceDialog;
