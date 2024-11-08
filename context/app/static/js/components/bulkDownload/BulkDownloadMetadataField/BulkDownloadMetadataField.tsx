import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { PrimarySwitch } from 'js/shared-styles/switches';
import { StyledFormLabel } from 'js/components/bulkDownload/style';

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
      <StyledFormLabel id="bulk-download-metadata">Download Metadata File (TSV)</StyledFormLabel>
      <PrimarySwitch
        checked={field.value === true}
        onChange={(e) => field.onChange(!!e.target.checked)}
        inputProps={{ 'aria-labelledby': 'bulk-download-metadata' }}
      />
    </Stack>
  );
}

export default BulkDownloadMetadataField;
