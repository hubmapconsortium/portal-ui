import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import useSavedListsStore from 'js/stores/useSavedListsStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledPrimaryOutlineTextField } from './style';

const maxTitleLength = 50;
const useSavedListsStoreSelector = (state) => state.createList;

function CreateListDialog({ dialogIsOpen, setDialogIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createList = useSavedListsStore(useSavedListsStoreSelector);

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
          <StyledPrimaryOutlineTextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="outlined"
            placeholder='Like “Spleen-Related Data” or “ATAC-seq Visualizations"'
            inputProps={{ maxLength: maxTitleLength }}
            onChange={handleTitleChange}
            required
            helperText={`${title.length}/${maxTitleLength} Characters`}
            value={title}
          />
          <StyledPrimaryOutlineTextField
            id="description"
            label="Description (optional)"
            fullWidth
            variant="outlined"
            placeholder="Input description of list"
            multiline
            rows={5}
            inputProps={{ maxLength: 1000 }}
            onChange={handleDescriptionChange}
            value={description}
          />
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
