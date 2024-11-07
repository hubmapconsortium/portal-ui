import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';

type BulkDownloadOptionsFieldProps<FormType extends FieldValues> = Pick<
  UseControllerProps<FormType>,
  'name' | 'control'
>;
function BulkDownloadOptionsField<FormType extends FieldValues>({
  control,
  name,
}: BulkDownloadOptionsFieldProps<FormType>) {
  const { downloadOptions } = useBulkDownloadDialog();
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
      <FormGroup aria-labelledby="bulk-download-options">
        <FormControlLabel
          key="all"
          control={
            <Checkbox
              checked={downloadOptions.every((option) => (field.value as string[]).includes(option.key))}
              onChange={(e) => {
                const newValue = e.target.checked ? downloadOptions.map((option) => option.key) : [];
                field.onChange(newValue);
              }}
            />
          }
          label="Select all files."
        />
        <Divider />
        <Stack paddingLeft={2}>
          {downloadOptions.map(({ key, label }) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={(field.value as string[]).includes(key)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...field.value, key]
                      : (field.value as string[]).filter((item: string) => item !== key);
                    field.onChange(newValue);
                  }}
                />
              }
              label={`Select all ${label} files.`}
            />
          ))}
        </Stack>
      </FormGroup>
    </Box>
  );
}

export default BulkDownloadOptionsField;
