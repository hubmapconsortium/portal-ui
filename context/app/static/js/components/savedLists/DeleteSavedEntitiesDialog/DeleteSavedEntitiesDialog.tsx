import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';

interface DeleteSavedEntitiesDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  deleteSelectedSavedEntities: () => void;
}
function DeleteSavedEntitiesDialog({
  dialogIsOpen,
  setDialogIsOpen,
  deleteSelectedSavedEntities,
}: DeleteSavedEntitiesDialogProps) {
  function handleDelete() {
    deleteSelectedSavedEntities();
    setDialogIsOpen(false);
  }
  return (
    <DialogModal
      title="Delete Items"
      content={<Typography variant="body1">Are you sure you want to delete these from your saved items?</Typography>}
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
