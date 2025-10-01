import React, { useCallback } from 'react';
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

  const multipleOptionsAvailable = downloadOptions.length > 1;

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked ? downloadOptions.map((option) => option.key) : [];
      field.onChange(newValue);
    },
    [downloadOptions, field],
  );

  const handleSelectOne = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      const newValue = e.target.checked
        ? [...field.value, key]
        : (field.value as string[]).filter((item: string) => item !== key);
      field.onChange(newValue);
    },
    [field],
  );

  return (
    <Box>
      <StyledFormLabel id="bulk-download-options">Download Options</StyledFormLabel>
      <FormGroup aria-labelledby="bulk-download-options">
        {/* 'Select all' option shown when multiple download options are present */}
        {multipleOptionsAvailable && (
          <Stack>
            <FormControlLabel
              key="all"
              control={
                <Checkbox
                  size="small"
                  checked={downloadOptions.every((option) => (field.value as string[]).includes(option.key))}
                  onChange={handleSelectAll}
                />
              }
              label="Select all files."
            />
            <Divider />
          </Stack>
        )}
        {/* All download options */}
        <Stack paddingLeft={multipleOptionsAvailable ? 4 : 0}>
          {downloadOptions.map(({ key, label, count }) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  size="small"
                  checked={(field.value as string[]).includes(key)}
                  onChange={(e) => {
                    handleSelectOne(e, key);
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
