import React, { useState } from 'react';
import { FieldValues, Path, PathValue, useController, UseControllerProps } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface WorkspaceFieldProps<FormType extends FieldValues>
  extends Pick<UseControllerProps<FormType>, 'name' | 'control'>,
    Omit<TextFieldProps<'outlined'>, 'variant' | 'name'> {
  label: string;
  value?: PathValue<FormType, Path<FormType>> | undefined;
  maxLength?: number;
}

function WorkspaceField<FormType extends FieldValues>({
  control,
  name,
  label,
  value,
  maxLength = 2000,
  ...rest
}: WorkspaceFieldProps<FormType>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: value,
  });

  const [charCount, setCharCount] = useState((field?.value as string)?.length ?? 0);

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        label={label || name}
        fullWidth
        error={fieldState.error !== undefined}
        helperText={fieldState?.error?.message}
        {...field}
        {...rest}
        onChange={(e) => {
          setCharCount(e.target.value.length);
          field.onChange(e);
        }}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { maxLength },
        }}
      />
      <Typography variant="caption" color="textSecondary" align="right" marginTop={0.5} marginRight={2}>
        {charCount}/{maxLength} Characters
      </Typography>
    </Box>
  );
}

export default WorkspaceField;
