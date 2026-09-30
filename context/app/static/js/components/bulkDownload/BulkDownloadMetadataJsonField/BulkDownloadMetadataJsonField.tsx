import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PrimarySwitch } from 'js/shared-styles/switches';
import { StyledFormLabel } from 'js/components/bulkDownload/style';
import { DATASET_METADATA_FILE } from 'js/helpers/manifest';

type BulkDownloadMetadataJsonFieldProps<FormType extends FieldValues> = Pick<
  UseControllerProps<FormType>,
  'name' | 'control'
>;

/**
 * Adds each selected dataset's root `metadata.json` to the manifest.
 *
 * Deliberately worded to contrast with the neighbouring "Download Metadata File (TSV)" switch: that
 * one downloads a spreadsheet from the portal, this one adds a file to the CLT manifest. Only shown
 * for file-level selections -- a whole-dataset manifest line already includes it.
 */
function BulkDownloadMetadataJsonField<FormType extends FieldValues>({
  control,
  name,
}: BulkDownloadMetadataJsonFieldProps<FormType>) {
  const { field } = useController({ name, control });

  return (
    <Stack>
      <StyledFormLabel id="bulk-download-metadata-json">
        {`Include each dataset's ${DATASET_METADATA_FILE} in the manifest`}
      </StyledFormLabel>
      <Typography variant="caption" color="secondary">
        {`Adds the ${DATASET_METADATA_FILE} file at the root of each dataset, alongside the files you selected.`}
      </Typography>
      <PrimarySwitch
        checked={field.value}
        onChange={(e) => {
          field.onChange(!!e.target.checked);
        }}
        inputProps={{ 'aria-labelledby': 'bulk-download-metadata-json' }}
        sx={(theme) => ({ marginLeft: theme.spacing(-1) })}
      />
    </Stack>
  );
}

export default BulkDownloadMetadataJsonField;
