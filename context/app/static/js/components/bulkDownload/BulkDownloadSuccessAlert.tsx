import React from 'react';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { Alert } from 'js/shared-styles/alerts/Alert';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { LINKS } from 'js/components/bulkDownload/constants';

function BulkDownloadSuccessAlert() {
  const { downloadSuccess, setDownloadSuccess } = useBulkDownloadStore();

  if (!downloadSuccess) {
    return null;
  }

  return (
    <Alert onClose={() => setDownloadSuccess(false)} $marginBottom={10}>
      Download successful. In order to download the files that are in the manifest file,{' '}
      <OutboundLink href={LINKS.installation}>install</OutboundLink> the HuBMAP CLT and follow{' '}
      <OutboundLink href={LINKS.documentation}>instructions</OutboundLink> for how to use it with the manifest file.
      {/* TODO: uncomment once tutorial is up */}
      {/* A tutorial is available to guide you through the entire process. */}
    </Alert>
  );
}

export default BulkDownloadSuccessAlert;
