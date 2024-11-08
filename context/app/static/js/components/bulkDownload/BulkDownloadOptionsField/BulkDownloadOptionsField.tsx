import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { StyledFormLabel } from 'js/components/bulkDownload/style';

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

  const multipleOptions = downloadOptions.length > 1;

  return (
    <Box>
      <StyledFormLabel id="bulk-download-options">Download Options</StyledFormLabel>
      <FormGroup aria-labelledby="bulk-download-options">
        {multipleOptions && (
          <Stack>
            <FormControlLabel
              key="all"
              control={
                <Checkbox
                  size="small"
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
          </Stack>
        )}
        <Stack paddingLeft={multipleOptions ? 4 : 0}>
          {downloadOptions.map(({ key, label, count }) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  size="small"
                  checked={(field.value as string[]).includes(key)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...field.value, key]
                      : (field.value as string[]).filter((item: string) => item !== key);
                    field.onChange(newValue);
                  }}
                />
              }
              label={`Select all ${label} files. (${count} Relevant Datasets)`}
            />
          ))}
        </Stack>
      </FormGroup>
    </Box>
  );
}

export default BulkDownloadOptionsField;
