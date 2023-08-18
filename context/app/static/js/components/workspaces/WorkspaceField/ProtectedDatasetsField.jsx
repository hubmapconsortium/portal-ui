import React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';
import { useController } from 'react-hook-form';

import { useHandleCopyClick } from 'js/hooks/useCopyText';
import WorkspaceField from './WorkspaceField';

const name = 'Protected Datasets';

function ProtectedDatasetsField({ control, label, errors, value, ...rest }) {
  const handleCopyClick = useHandleCopyClick();
  const { field } = useController({
    name,
    label,
    control,
    rules: { required: true },
    defaultValue: value,
  });

  return (
    <WorkspaceField
      label={name}
      name={name}
      {...rest}
      readOnly
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => handleCopyClick(field.value)}>
              <ContentCopyIcon />
            </IconButton>
          </InputAdornment>
        ),
        readOnly: true,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
    />
  );
}

export default ProtectedDatasetsField;
