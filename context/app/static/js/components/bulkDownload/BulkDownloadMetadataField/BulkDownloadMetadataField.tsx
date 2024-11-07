import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import FormLabel from '@mui/material/FormLabel';
import { PrimarySwitch } from 'js/shared-styles/switches';

type BulkDownloadMetadataFieldProps<FormType extends FieldValues> = Pick<
  UseControllerProps<FormType>,
  'name' | 'control'
>;
function BulkDownloadMetadataField<FormType extends FieldValues>({
  control,
  name,
}: BulkDownloadMetadataFieldProps<FormType>) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <Stack>
      <FormLabel
        id="bulk-download-metadata"
        sx={(theme) => ({ ...theme.typography.button, color: theme.palette.text.primary })}
      >
        Download Metadata File (TSV)
      </FormLabel>
      <PrimarySwitch
        checked={field.value === true}
        onChange={(e) => field.onChange(!!e.target.checked)}
        inputProps={{ 'aria-labelledby': 'bulk-download-metadata' }}
      />
    </Stack>
  );
}

export default BulkDownloadMetadataField;
