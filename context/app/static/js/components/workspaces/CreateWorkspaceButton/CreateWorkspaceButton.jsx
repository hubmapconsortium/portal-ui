import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { AddIcon } from 'js/shared-styles/icons';
import DialogModal from 'js/shared-styles/DialogModal';

function CreateWorkspaceButton({ handleCreateWorkspace }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');

  function handleClose() {
    setDialogIsOpen(false);
  }

  function handleSubmit() {
    handleCreateWorkspace({ workspaceName });
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
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Name"
            helperText="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
            value={workspaceName}
            name="workspaceName"
            variant="outlined"
            onChange={(e) => setWorkspaceName(e.target.value)}
            fullWidth
          />
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </>
        }
      />
    </>
  );
}

export default CreateWorkspaceButton;
