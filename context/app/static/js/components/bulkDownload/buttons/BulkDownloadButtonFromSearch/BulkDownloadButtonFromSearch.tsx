import React from 'react';
import BulkDownloadButton from 'js/components/bulkDownload/buttons/BulkDownloadButton/BulkDownloadButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { EventInfo } from 'js/components/types';

const tooltip = 'Bulk download files for selected datasets.';

interface BulkDownloadButtonFromSearchProps {
  type: string;
  trackingInfo?: EventInfo;
}

function BulkDownloadButtonFromSearch({ type, trackingInfo }: BulkDownloadButtonFromSearchProps) {
  const { selectedRows } = useSelectableTableStore();

  const disabled = selectedRows.size === 0;
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!isDatasetSearch) {
    return null;
  }

  return (
    <BulkDownloadButton
      tooltip={disabled ? 'Select datasets for download.' : tooltip}
      uuids={selectedRows}
      disabled={disabled}
      trackingInfo={trackingInfo}
    />
  );
}

export default BulkDownloadButtonFromSearch;
