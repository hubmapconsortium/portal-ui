import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { useBulkDownloadDialog, BulkDownloadFormTypes } from 'js/components/bulkDownload/hooks';

const formId = 'launch-workspace-form';

function BulkDownloadDialog() {
  const { handleSubmit, submit, isSubmitting, isOpen, handleClose } = useBulkDownloadDialog();

  const onSubmit = useCallback(
    ({ bulkDownloadOptions }: BulkDownloadFormTypes) => {
      submit({ bulkDownloadOptions });
      handleClose();
    },
    [submit, handleClose],
  );

  return (
    <DialogModal
      title="Bulk Download Files"
      maxWidth="md"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={1}>
            <SummaryPaper>
              <Stack direction="column" spacing={2}>
                {/* <WorkspaceJobTypeField control={control} name="workspaceJobTypeId" /> */}
              </Stack>
            </SummaryPaper>
            {/* <AdvancedConfigOptions control={control} description={text.resources.description} /> */}
          </Stack>
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" form={formId} loading={isSubmitting}>
            Generate Download Manifest
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default BulkDownloadDialog;
