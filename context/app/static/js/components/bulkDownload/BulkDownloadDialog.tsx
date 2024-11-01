import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import Step from 'js/shared-styles/surfaces/Step';
import BulkDownloadOptionsField from 'js/components/bulkDownload/BulkDownloadOptionsField';
import BulkDownloadMetadataField from 'js/components/bulkDownload/BulkDownloadMetadataField';

const formId = 'bulk-download-form';

function BulkDownloadDialog() {
  const { handleSubmit, onSubmit, isOpen, handleClose, control } = useBulkDownloadDialog();

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
