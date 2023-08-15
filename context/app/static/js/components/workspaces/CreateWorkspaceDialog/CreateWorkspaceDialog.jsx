import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import DialogModal from 'js/shared-styles/DialogModal';
import { useCreateWorkspace } from './hooks';

function CreateWorkspaceDialog({
  handleCreateWorkspace,
  buttonComponent: ButtonComponent,
  defaultName,
  selectedRowsError,
  protectedHubmapIds,
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
            id="create-workspace-form"
            component="form"
            sx={{
              display: 'grid',
              gap: 2,
              marginTop: 1,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {protectedHubmapIds.length > 0 && (
              <WorkspaceField
                control={control}
                name="Protected Datasets"
                errors={errors}
                // eslint-disable-next-line no-underscore-dangle
                value={protectedHubmapIds}
              />
            )}
            <WorkspaceField control={control} name="name" label="Name" errors={errors} />
          </Box>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="create-workspace-form" disabled={selectedRowsError.length > 0}>
              Submit
            </Button>
          </>
        }
        selectedRowsError={selectedRowsError}
      />
    </>
  );
}

export default CreateWorkspaceDialog;
