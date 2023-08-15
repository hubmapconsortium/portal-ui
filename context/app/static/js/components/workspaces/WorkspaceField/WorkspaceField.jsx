import React from 'react';
import { useController } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';

import { useSnackbarStore } from 'js/shared-styles/snackbars';

function WorkspaceField({ control, name, label, errors, value }) {
  const { openSnackbar } = useSnackbarStore();
  const { field } = useController({
    name,
    label,
    control,
    rules: { required: true },
    defaultValue: value,
  });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(field.value).then(() => {
      openSnackbar('Copied to clipboard.');
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        InputLabelProps={{ shrink: true }}
        label={label || name}
        placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
        variant="outlined"
        fullWidth
        name={name}
        {...field}
        error={Object.keys(errors).length > 0}
        helperText={errors.name?.message || ''}
        InputProps={
          name === 'Protected Datasets'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyClick}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : null
        }
        sx={
          name === 'Protected Datasets'
            ? {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }
            : null
        }
      />
    </div>
  );
}
export default WorkspaceField;
