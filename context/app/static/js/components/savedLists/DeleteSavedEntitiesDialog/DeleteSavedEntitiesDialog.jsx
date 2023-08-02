import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import DialogModal from 'js/shared-styles/DialogModal';

function DeleteSavedEntitiesDialog({ dialogIsOpen, setDialogIsOpen, deleteSelectedSavedEntities }) {
  function handleDelete() {
    deleteSelectedSavedEntities();
    setDialogIsOpen(false);
  }
  return (
    <DialogModal
      title="Delete Items"
      content={
        <Typography variant="body1">Are you sure you want to delete these items from your My Saves List?</Typography>
      }
      actions={
        <>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete()}>Delete</Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  );
}

export default DeleteSavedEntitiesDialog;
