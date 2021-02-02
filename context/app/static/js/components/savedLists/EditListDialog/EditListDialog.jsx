import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state) => ({ createList: state.createList, deleteList: state.deleteList });

function EditListDialog({ dialogIsOpen, setDialogIsOpen, listDescription, listTitle, setEditedListTitle }) {
  const [title, setTitle] = useState(listTitle);
  const [description, setDescription] = useState(listDescription);

  const { createList, deleteList } = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  const handleClose = () => {
    setDialogIsOpen(false);
    setTitle(listTitle);
    setDescription(listDescription);
  };

  function handleSubmit() {
    createList({ title, description });
    setEditedListTitle(title);
    deleteList(listTitle);
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title={`Edit ${listTitle}`}
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
          <Button onClick={() => handleSubmit()} color="primary" disabled={title.length === 0}>
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
    />
  );
}

export default EditListDialog;
