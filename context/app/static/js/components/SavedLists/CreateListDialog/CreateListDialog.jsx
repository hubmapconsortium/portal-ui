import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { StyledPrimaryOutlineTextField, StyledDivider } from './style';

const maxTitleLength = 50;

function CreateListDialog({ dialogIsOpen, setDialogIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    <Dialog open={dialogIsOpen} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle id="create-list-form-dialog-title">Create New List</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <StyledDivider />
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button color="primary" disabled={title.length === 0}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateListDialog;
