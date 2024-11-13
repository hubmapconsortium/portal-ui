import React from 'react';

import BulkDownloadButton from 'js/components/bulkDownload/BulkDownloadButton/BulkDownloadButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

const tooltip =
  'Bulk download files for selected datasets. If no datasets are selected, all datasets given the current filters will be selected.';

function BulkDownloadButtonFromSearch({ type, allResultsUUIDs }: { type: string; allResultsUUIDs: Set<string> }) {
  const { selectedRows, deselectRows } = useSelectableTableStore();

  const isDatasetSearch = type.toLowerCase() === 'dataset';
  if (!isDatasetSearch) {
    return null;
  }

  return (
    <BulkDownloadButton
      tooltip={tooltip}
      deselectRows={deselectRows}
      uuids={selectedRows.size > 0 ? selectedRows : allResultsUUIDs}
      sx={(theme) => ({ margin: theme.spacing(0, 1) })}
    />
  );
}

export default BulkDownloadButtonFromSearch;
