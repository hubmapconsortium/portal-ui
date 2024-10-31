import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { useBulkDownloadDialog, BulkDownloadFormTypes } from 'js/components/bulkDownload/hooks';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import Step from 'js/shared-styles/surfaces/Step';
import BulkDownloadOptionsField from 'js/components/bulkDownload/BulkDownloadOptionsField';
import BulkDownloadMetadataField from 'js/components/bulkDownload/BulkDownloadMetadataField';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

const formId = 'bulk-download-form';

function BulkDownloadDialog() {
  const { handleSubmit, submit, isOpen, handleClose, control } = useBulkDownloadDialog();
  const { toastError } = useSnackbarActions();

  const onSubmit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      try {
        submit({ bulkDownloadOptions, bulkDownloadMetadata });
      } catch (e) {
        toastError('Error creating bulk download manifest.');
        console.error(e);
      }

      handleClose();
    },
    [submit, handleClose, toastError],
  );

  return (
    <DialogModal
      title="Bulk Download Files"
      maxWidth="lg"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={1}>
            <SectionDescription>(todo)</SectionDescription>
            <Step title="Download Options" hideRequiredText>
              <SectionDescription>(description)</SectionDescription>
              <SummaryPaper>
                <Stack direction="column" spacing={2}>
                  <BulkDownloadOptionsField control={control} name="bulkDownloadOptions" />
                  <BulkDownloadMetadataField control={control} name="bulkDownloadMetadata" />
                </Stack>
              </SummaryPaper>
            </Step>
          </Stack>
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" form={formId}>
            Generate Download Manifest
          </Button>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default BulkDownloadDialog;
