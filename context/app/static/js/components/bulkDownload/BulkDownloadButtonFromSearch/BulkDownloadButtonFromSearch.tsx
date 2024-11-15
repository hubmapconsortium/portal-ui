import React from 'react';
import BulkDownloadButton from 'js/components/bulkDownload/BulkDownloadButton/BulkDownloadButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

const tooltip =
  'Bulk download files for selected datasets. If no datasets are selected, all datasets given the current filters will be selected.';

interface BulkDownloadButtonFromSearchProps {
  type: string;
  allResultsUUIDs: string[];
}
function BulkDownloadButtonFromSearch({ type, allResultsUUIDs }: BulkDownloadButtonFromSearchProps) {
  const { selectedRows, deselectRows } = useSelectableTableStore();

  const disabled = allResultsUUIDs.length === 0;
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!isDatasetSearch) {
    return null;
  }

  return (
    <BulkDownloadButton
      tooltip={disabled ? 'Loading datasets...' : tooltip}
      deselectRows={deselectRows}
      uuids={selectedRows.size > 0 ? selectedRows : new Set(allResultsUUIDs)}
      disabled={disabled}
    />
  );
}

export default BulkDownloadButtonFromSearch;
