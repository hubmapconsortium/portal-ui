import React from 'react';
import Button from '@material-ui/core/Button';

import { AddIcon } from 'js/shared-styles/icons';
import CreateWorkspaceDialog from 'js/components/workspaces/CreateWorkspaceDialog';
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
      <CreateWorkspaceDialog
        dialogIsOpen={dialogIsOpen}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
      />
    </>
  );
}

export default CreateWorkspaceButton;
