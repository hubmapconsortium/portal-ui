import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

const downloadOptions = {
  all: 'Select all files (raw and processed).',
  raw: 'Select only raw files.',
  processed: 'Select only processed files.',
};

type BulkDownloadOptionsFieldProps<FormType extends FieldValues> = Pick<
  UseControllerProps<FormType>,
  'name' | 'control'
>;
function BulkDownloadOptionsField<FormType extends FieldValues>({
  control,
  name,
}: BulkDownloadOptionsFieldProps<FormType>) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <Box>
      <FormLabel
        id="bulk-download-options"
        sx={(theme) => ({ ...theme.typography.button, color: theme.palette.text.primary })}
      >
        Download Options
      </FormLabel>
      <RadioGroup
        aria-labelledby="bulk-download-options"
        name="bulk-download-options-radio-buttons"
        value={field.value}
        onChange={(e, value) => field.onChange(value)}
      >
        {Object.entries(downloadOptions).map(([key, value]) => (
          <FormControlLabel value={key} control={<Radio />} label={value} key={key} />
        ))}
      </RadioGroup>
    </Box>
  );
}

export default BulkDownloadOptionsField;
