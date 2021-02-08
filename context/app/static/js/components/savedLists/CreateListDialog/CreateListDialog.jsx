import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state) => ({ createList: state.createList, savedLists: state.savedLists });

function CreateListDialog({ dialogIsOpen, setDialogIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);
  const { createList, savedLists } = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event) {
    setTitle(event.target.value);
    if (shouldDisplayWarning) {
      setShouldDisplayWarning(false);
    }
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
    if (!(title in savedLists)) {
      createList({ title, description });
      setDialogIsOpen(false);
    } else {
      setShouldDisplayWarning(true);
    }
  }

  return (
    <DialogModal
      title="Create New List"
      warning={shouldDisplayWarning && 'A list with that title already exists.'}
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
          <Button onClick={handleSubmit} color="primary" disabled={title.length === 0}>
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
      onExited={handleExit}
    />
  );
}

export default CreateListDialog;
