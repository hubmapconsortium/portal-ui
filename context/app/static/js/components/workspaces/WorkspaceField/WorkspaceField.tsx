import React from 'react';
import { FieldValues, Path, PathValue, useController, UseControllerProps } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface WorkspaceFieldProps<FormType extends FieldValues>
  extends Pick<UseControllerProps<FormType>, 'name' | 'control'>,
    Omit<TextFieldProps<'outlined'>, 'variant' | 'name'> {
  label: string;
  value?: PathValue<FormType, Path<FormType>> | undefined;
}

function WorkspaceField<FormType extends FieldValues>({
  control,
  name,
  label,
  value,
  ...rest
}: WorkspaceFieldProps<FormType>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: value,
  });

  return (
    <Box display="flex" alignItems="center">
      <TextField
        InputLabelProps={{ shrink: true }}
        label={label || name}
        fullWidth
        error={fieldState.error !== undefined}
        helperText={fieldState?.error?.message}
        {...field}
        {...rest}
      />
    </Box>
  );
}
export default WorkspaceField;
