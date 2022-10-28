import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import CreateWorkspaceInput from 'js/components/workspaces/CreateWorkspaceInput';
import { AddIcon } from 'js/shared-styles/icons';
import DialogModal from 'js/shared-styles/DialogModal';

const schema = yup
  .object({
    name: yup.string().required().max(10),
  })
  .required();

function CreateWorkspaceButton({ handleCreateWorkspace }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit({ name: workspaceName }) {
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
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CreateWorkspaceInput control={control} name="name" />
              <input type="submit" id="create-workspace-input" hidden />
            </form>
            <Typography color="error">{errors.name?.message}</Typography>
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
