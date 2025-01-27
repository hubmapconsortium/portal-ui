import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import DialogModal from 'js/shared-styles/DialogModal';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

interface CreateListDialogProps {
  secondaryText?: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
}

function CreateListDialog({ secondaryText, dialogIsOpen, setDialogIsOpen }: CreateListDialogProps) {
  const { handleCreateList } = useSavedLists();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value);
  }

  const handleClose = () => {
    setDialogIsOpen(false);
    setTitle('');
    setDescription('');
  };

  function handleSubmit() {
    handleCreateList({ title, description }).catch((error) => {
      console.error(error);
    });
    handleClose();
  }

  const dialogContent = (
    <>
      <StyledTitleTextField handleChange={handleTitleChange} title={title} />
      <StyledDescriptionTextField handleChange={handleDescriptionChange} description={description} />
    </>
  );

  const dialogActions = (
    <>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <OptDisabledButton onClick={handleSubmit} color="primary" disabled={title.length === 0}>
        Save
      </OptDisabledButton>
    </>
  );

  return (
    <DialogModal
      title="Create New List"
      secondaryText={secondaryText}
      content={dialogContent}
      actions={dialogActions}
      isOpen={dialogIsOpen}
      handleClose={handleClose}
    />
  );
}

export default CreateListDialog;
