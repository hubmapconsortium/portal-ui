import React, { useState } from 'react';
import Button from '@mui/material/Button';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state) => state.createList;

function CreateListDialog({ secondaryText, dialogIsOpen, setDialogIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createList = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  const handleClose = () => {
    setDialogIsOpen(false);
  };

  function handleExit() {
    setTitle('');
    setDescription('');
  }

  function handleSubmit() {
    createList({ title, description });
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title="Create New List"
      secondaryText={secondaryText}
      content={
        <>
          <StyledTitleTextField handleChange={handleTitleChange} title={title} />
          <StyledDescriptionTextField handleChange={handleDescriptionChange} description={description} />
        </>
      }
      actions={
        <>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <OptDisabledButton onClick={handleSubmit} color="primary" disabled={title.length === 0}>
            Save
          </OptDisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
      onExited={handleExit}
    />
  );
}

export default CreateListDialog;
