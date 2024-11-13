import React from 'react';
import { Control } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { BulkDownloadFormTypes, useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import Step from 'js/shared-styles/surfaces/Step';
import BulkDownloadOptionsField from 'js/components/bulkDownload/BulkDownloadOptionsField';
import BulkDownloadMetadataField from 'js/components/bulkDownload/BulkDownloadMetadataField';
import { OutboundLink } from 'js/shared-styles/Links';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Alert } from 'js/shared-styles/alerts';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import RemoveProtectedDatasetsFormField from 'js/components/workspaces/RemoveProtectedDatasetsFormField';
import { DatasetAccessLevelHits } from 'js/hooks/useProtectedDatasets';

const links = {
  // TODO: Update tutorial link once created
  tutorial: '/tutorials',
  installation: 'https://docs.hubmapconsortium.org/clt/install-hubmap-clt.html',
  documentation: 'https://docs.hubmapconsortium.org/clt/index.html',
};

const pages = [
  // TODO: uncomment once tutorial is created
  // {
  //   link: links.tutorial,
  //   children: 'Tutorial',
  // },
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

function DownloadDescription() {
  return (
    <SectionDescription>
      <Stack spacing={2}>
        <Box>
          Choose download options to bulk download files from your selected datasets. Your selection of files will
          generate a manifest file, which can be used with the{' '}
          <OutboundLink href={links.documentation}>HuBMAP Command Line Transfer (CLT)</OutboundLink> tool for
          downloading. An option to download a tsv file of the metadata is also available.
        </Box>
        <Box>
          To download the files included in the manifest file,{' '}
          <OutboundLink href={links.installation}>install the HuBMAP CLT</OutboundLink> (if not already installed) and
          follow <OutboundLink href={links.documentation}>instructions</OutboundLink> for how to use it with the
          manifest file.
          {/* TODO: uncomment once tutorial is created */}
          {/* A <OutboundLink href={links.tutorial}>tutorial</OutboundLink> is available to guide you through
          the entire process. */}
        </Box>
        <RelevantPagesSection pages={pages} />
      </Stack>
    </SectionDescription>
  );
}

function ProtectedDatasetsSection({
  control,
  errorMessages,
  protectedHubmapIds,
  protectedRows,
  removeProtectedDatasets,
}: {
  control: Control<BulkDownloadFormTypes>;
  errorMessages: string[];
  protectedHubmapIds: string;
  protectedRows: DatasetAccessLevelHits;
  removeProtectedDatasets: () => void;
}) {
  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <Stack paddingY={1}>
      <ErrorOrWarningMessages errorMessages={errorMessages} />
      <RemoveProtectedDatasetsFormField
        control={control}
        protectedHubmapIds={protectedHubmapIds}
        removeProtectedDatasets={removeProtectedDatasets}
        protectedRows={protectedRows}
      />
    </Stack>
  );
}

function DownloadOptionsDescription() {
  return (
    <SectionDescription>
      <Stack spacing={2}>
        <Box>Select raw and/or processed files to download.</Box>
        <LabelledSectionText label="Raw Data" spacing={1}>
          Raw data consists of files as originally submitted by the data submitters. Individuals files for raw data
          cannot be previewed or selected for the manifest download. You must download all raw files, and the total
          download size cannot be estimated.
        </LabelledSectionText>
        <LabelledSectionText label="Processed Data" spacing={1}>
          Processed data includes files associated with data generated by HuBMAP using uniform processing pipelines or
          by an external processing approach. Only files centrally processed by HuBMAP are available for individual
          selection, which can be done in the Advanced Selections section below.
        </LabelledSectionText>
      </Stack>
    </SectionDescription>
  );
}

function DownloadSelection({
  control,
  downloadOptions,
  isLoading,
  errorMessages,
  protectedHubmapIds,
  protectedRows,
  removeProtectedDatasets,
}: {
  control: Control<BulkDownloadFormTypes>;
  downloadOptions: {
    key: string;
    label: string;
  }[];
  isLoading: boolean;
  errorMessages: string[];
  protectedHubmapIds: string;
  protectedRows: DatasetAccessLevelHits;
  removeProtectedDatasets: () => void;
}) {
  if (isLoading) {
    return <Skeleton variant="text" height="20rem" />;
  }

  return downloadOptions.length > 0 ? (
    <Box>
      <Step title="Download Options" hideRequiredText>
        <ProtectedDatasetsSection
          control={control}
          errorMessages={errorMessages}
          protectedHubmapIds={protectedHubmapIds}
          protectedRows={protectedRows}
          removeProtectedDatasets={removeProtectedDatasets}
        />
        <DownloadOptionsDescription />
        <SummaryPaper>
          <Stack direction="column" spacing={2}>
            <BulkDownloadOptionsField control={control} name="bulkDownloadOptions" />
            <BulkDownloadMetadataField control={control} name="bulkDownloadMetadata" />
          </Stack>
        </SummaryPaper>
      </Step>
    </Box>
  ) : (
    <Box paddingTop={1}>
      <Alert severity="warning">
        <Typography>Files are not available for any of the selected datasets.</Typography>
      </Alert>
    </Box>
  );
}

const formId = 'bulk-download-form';

function BulkDownloadDialog({ deselectRows }: { deselectRows?: (uuids: string[]) => void }) {
  const {
    handleSubmit,
    onSubmit,
    handleClose,
    isOpen,
    errors,
    control,
    isLoading,
    downloadOptions,
    errorMessages,
    ...rest
  } = useBulkDownloadDialog({ deselectRows });

  return (
    <DialogModal
      title="Bulk Download Files"
      maxWidth="lg"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <DownloadDescription />
            <DownloadSelection
              control={control}
              downloadOptions={downloadOptions}
              isLoading={isLoading}
              errorMessages={errorMessages}
              {...rest}
            />
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
          <Button
            type="submit"
            variant="contained"
            form={formId}
            disabled={Object.keys(errors).length > 0 || errorMessages.length > 0}
          >
            Generate Download Manifest
          </Button>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default BulkDownloadDialog;
