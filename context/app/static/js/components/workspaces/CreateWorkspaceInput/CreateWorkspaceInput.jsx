import React from 'react';

import TextField from '@material-ui/core/TextField';
import { useController } from 'react-hook-form';

function CreateWorkspaceInput({ control, name }) {
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
      helperText="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
      variant="outlined"
      fullWidth
      name={name}
      {...field}
    />
  );
}
export default CreateWorkspaceInput;
