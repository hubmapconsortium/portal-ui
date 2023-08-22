import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import DialogModal from 'js/shared-styles/DialogModal';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({
  handleCreateWorkspace,
  buttonComponent: ButtonComponent,
  defaultName,
  errorMessages = [],
  // Pass in a function that returns a component to render any additional fields
  // in the CreateWorkspaceDialog, using the `control` and `errors` props from react-hook-form
  renderAdditionalFields = () => null,
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
          rest?.onClick?.();
        }}
        {...rest}
      />
      <DialogModal
        title="Launch New Workspace"
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        errorMessages={errorMessages}
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
            {renderAdditionalFields({ control, errors })}
            <WorkspaceField
              control={control}
              name="workspace-name"
              disabled={errorMessages.length > 0}
              label="Name"
              placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
              errors={errors}
              autoFocus
            />
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="create-workspace-form" disabled={errorMessages.length > 0}>
              Launch
            </Button>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceDialog;
