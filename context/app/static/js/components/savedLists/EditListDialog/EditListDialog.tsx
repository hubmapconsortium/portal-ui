import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';

import useSavedLists from 'js/components/savedLists/hooks';
import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

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

  const { handleEditList, savedLists } = useSavedLists();

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
      handleEditList({ listUUID, title, description }).catch((error) => {
        console.error(error);
      });
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
