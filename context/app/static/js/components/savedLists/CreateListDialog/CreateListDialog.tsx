import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state: SavedEntitiesStore) => state.createList;

interface CreateListDialogProps {
  secondaryText?: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
}

function CreateListDialog({ secondaryText, dialogIsOpen, setDialogIsOpen }: CreateListDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createList = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
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
      handleClose={() => {
        handleClose();
        handleExit();
      }}
    />
  );
}

export default CreateListDialog;
