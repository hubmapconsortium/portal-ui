import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import DialogModal from 'js/shared-styles/DialogModal';
import { OrangeButton } from './styles';

function DeleteSavedEntitiesDialog({ dialogIsOpen, setDialogIsOpen, deleteSelectedSavedEntities }) {
  function handleDelete() {
    deleteSelectedSavedEntities();
    setDialogIsOpen(false);
  }
  return (
    <DialogModal
      title="Delete Items"
      content={
        <Typography variant="bodyy1">Are you sure you want to delete these items from your My Saves List?</Typography>
      }
      actions={
        <>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Cancel
          </Button>
          <OrangeButton onClick={() => handleDelete()} color="warning">
            Delete
          </OrangeButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  );
}

export default DeleteSavedEntitiesDialog;
