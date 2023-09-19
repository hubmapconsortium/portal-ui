import React from 'react';
import { useController } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function WorkspaceField({ control, name, label, errors, value, ...rest }) {
  const { field } = useController({
    name,
    label,
    control,
    rules: { required: true },
    defaultValue: value,
  });

  return (
    <Box display="flex" alignItems="center">
      <TextField
        InputLabelProps={{ shrink: true }}
        label={label || name}
        variant="outlined"
        fullWidth
        name={name}
        {...field}
        error={Object.keys(errors).length > 0}
        helperText={errors.name?.message || ''}
        {...rest}
      />
    </Box>
  );
}
export default WorkspaceField;
