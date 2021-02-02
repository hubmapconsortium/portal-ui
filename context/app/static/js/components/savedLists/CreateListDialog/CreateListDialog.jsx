import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state) => state.createList;

function CreateListDialog({ dialogIsOpen, setDialogIsOpen }) {
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

  return (
    <DialogModal
      title="Create New List"
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
          <Button onClick={() => createList({ title, description })} color="primary" disabled={title.length === 0}>
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
    />
  );
}

export default CreateListDialog;
