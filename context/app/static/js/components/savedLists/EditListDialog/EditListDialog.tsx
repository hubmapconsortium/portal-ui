import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state: SavedEntitiesStore) => ({
  editList: state.editList,
  savedLists: state.savedLists,
});

interface EditListDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  listDescription: string;
  listTitle: string;
  listUUID: string;
}

function EditListDialog({ dialogIsOpen, setDialogIsOpen, listDescription, listTitle, listUUID }: EditListDialogProps) {
  const [title, setTitle] = useState(listTitle);
  const [description, setDescription] = useState(listDescription);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);

  const { editList, savedLists } = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    if (shouldDisplayWarning) {
      setShouldDisplayWarning(false);
    }
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value);
  }

  const handleClose = () => {
    setDialogIsOpen(false);
    setTitle(listTitle);
    setDescription(listDescription);
  };

  function handleSubmit() {
    if (!(title in savedLists)) {
      editList({ listUUID, title, description });
      setDialogIsOpen(false);
    } else {
      setShouldDisplayWarning(true);
    }
  }

  return (
    <DialogModal
      title={`Edit ${listTitle}`}
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
          <OptDisabledButton onClick={handleSubmit} color="primary" disabled={title.length === 0}>
            Save
          </OptDisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
    />
  );
}

export default EditListDialog;
