import React from 'react';

import TextField from '@mui/material/TextField';
import { useController } from 'react-hook-form';

function CreateWorkspaceInput({ control, name, errors }) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: '',
  });

  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      label="Name"
      placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
      variant="outlined"
      fullWidth
      name={name}
      {...field}
      error={Object.keys(errors).length > 0}
      helperText={errors.name?.message || ''}
    />
  );
}
export default CreateWorkspaceInput;
