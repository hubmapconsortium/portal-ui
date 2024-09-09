import React from 'react';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useJobTypes } from '../api';

type WorkspaceJobTypeFieldProps<FormType extends FieldValues> = Pick<UseControllerProps<FormType>, 'name' | 'control'>;

function WorkspaceJobTypeField<FormType extends FieldValues>({ control, name }: WorkspaceJobTypeFieldProps<FormType>) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  const { data } = useJobTypes();

  if (!data) {
    return null;
  }

  return (
    <Box>
      <FormLabel
        id="workspace-environment"
        sx={(theme) => ({ ...theme.typography.button, color: theme.palette.text.primary })}
      >
        Select Environment
      </FormLabel>
      <RadioGroup
        aria-labelledby="workspace-environment"
        name="workspace-environment-radio-buttons"
        value={field.value}
        onChange={(e, value) => field.onChange(value)}
      >
        {Object.values(data).map(({ id, name: jobTypeName }) => (
          <FormControlLabel value={id} control={<Radio />} label={jobTypeName} key={id} />
        ))}
      </RadioGroup>
    </Box>
  );
}

export default WorkspaceJobTypeField;
