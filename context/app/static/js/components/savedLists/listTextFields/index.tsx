import React from 'react';

import { PrimaryOutlinedTextField } from 'js/shared-styles/formFields';

const maxTitleLength = 50;

function TitleTextField({
  handleChange,
  title,
}: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}) {
  return (
    <PrimaryOutlinedTextField
      autoFocus
      margin="dense"
      id="title"
      label="Title"
      fullWidth
      variant="outlined"
      placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
      slotProps={{ htmlInput: { maxLength: maxTitleLength } }}
      onChange={handleChange}
      required
      helperText={`${title.length}/${maxTitleLength} Characters`}
      value={title}
    />
  );
}

function DescriptionTextField({
  handleChange,
  description,
}: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
}) {
  return (
    <PrimaryOutlinedTextField
      id="description"
      label="Description (optional)"
      fullWidth
      variant="outlined"
      placeholder="Input description of list"
      multiline
      rows={5}
      slotProps={{ htmlInput: { maxLength: 1000 } }}
      onChange={handleChange}
      value={description}
    />
  );
}

export { TitleTextField, DescriptionTextField };
