import React from 'react';
import BulkDownloadButton from 'js/components/bulkDownload/buttons/BulkDownloadButton/BulkDownloadButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

const tooltip = 'Bulk download files for selected datasets.';

interface BulkDownloadButtonFromSearchProps {
  type: string;
}

function BulkDownloadButtonFromSearch({ type }: BulkDownloadButtonFromSearchProps) {
  const { selectedRows, deselectRows } = useSelectableTableStore();

  const disabled = selectedRows.size === 0;
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!isDatasetSearch) {
    return null;
  }

  return (
    <BulkDownloadButton
      tooltip={disabled ? 'Select datasets for download.' : tooltip}
      deselectRows={deselectRows}
      uuids={selectedRows}
      disabled={disabled}
    />
  );
}

export default BulkDownloadButtonFromSearch;
