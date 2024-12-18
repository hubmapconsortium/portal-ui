import React from 'react';

import { PrimaryOutlinedTextField } from 'js/shared-styles/formFields';

const maxTitleLength = 50;

function TitleTextField({ handleChange, title }) {
  return (
    <PrimaryOutlinedTextField
      autoFocus
      margin="dense"
      id="title"
      label="Title"
      fullWidth
      variant="outlined"
      placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
      inputProps={{ maxLength: maxTitleLength }}
      onChange={handleChange}
      required
      helperText={`${title.length}/${maxTitleLength} Characters`}
      value={title}
    />
  );
}

function DescriptionTextField({ handleChange, description }) {
  return (
    <PrimaryOutlinedTextField
      id="description"
      label="Description (optional)"
      fullWidth
      variant="outlined"
      placeholder="Input description of list"
      multiline
      rows={5}
      inputProps={{ maxLength: 1000 }}
      onChange={handleChange}
      value={description}
    />
  );
}

export { TitleTextField, DescriptionTextField };
