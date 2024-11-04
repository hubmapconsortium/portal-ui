import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import Step from 'js/shared-styles/surfaces/Step';
import BulkDownloadOptionsField from 'js/components/bulkDownload/BulkDownloadOptionsField';
import BulkDownloadMetadataField from 'js/components/bulkDownload/BulkDownloadMetadataField';
import { OutboundLink } from 'js/shared-styles/Links';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';

const links = {
  tutorial: 'TODO',
  installation: 'https://docs.hubmapconsortium.org/clt/install-hubmap-clt.html',
  documentation: 'https://docs.hubmapconsortium.org/clt/index.html',
};

const pages = [
  {
    link: links.tutorial,
    children: 'Tutorial',
  },
  {
    link: links.installation,
    children: 'HuBMAP CLT Installation',
    external: true,
  },
  {
    link: links.documentation,
    children: 'HuBMAP CLT Documentation',
    external: true,
  },
];

function BulkDownloadExplanation() {
  return (
    <SectionDescription>
      <Stack spacing={2}>
        <Box>
          Choose download options to bulk download files from your selected datasets. Your selection of files will
          generate a manifest file, which can be used with the{' '}
          <OutboundLink href={links.documentation}>HuBMAP Command Line Transfer (CLT)</OutboundLink> tool for
          downloading.
        </Box>
        <Box>
          To download the files included in the manifest file,{' '}
          <OutboundLink href={links.installation}>install the HuBMAP CLT</OutboundLink> (if not already installed) and
          follow instructions for how to use it with the manifest file. A{' '}
          <OutboundLink href={links.tutorial}>tutorial</OutboundLink> is available to guide you through the entire
          process.
        </Box>
        <RelevantPagesSection pages={pages} />
      </Stack>
    </SectionDescription>
  );
}

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
            <BulkDownloadExplanation />
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
