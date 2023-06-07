import React, { useCallback, useState } from 'react';
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

  const handleTitleChange = useCallback(function handleTitleChange(event) {
    setTitle(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback(function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }, []);

  const handleClose = useCallback(
    function handleClose() {
      setDialogIsOpen(false);
    },
    [setDialogIsOpen],
  );

  const handleExit = useCallback(function handleExit() {
    setTitle('');
    setDescription('');
  }, []);

  const handleSubmit = useCallback(
    function handleSubmit() {
      createList({ title, description });
      setDialogIsOpen(false);
    },
    [createList, title, description, setDialogIsOpen],
  );

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
