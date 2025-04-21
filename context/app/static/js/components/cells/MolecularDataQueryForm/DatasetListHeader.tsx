import React from 'react';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { Copy } from 'js/shared-styles/tables/actions';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';

export default function DatasetListHeader() {
  const selectedUuids = useSelectableTableStore((state) => state.selectedRows);
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle1">Datasets</Typography>
      <Stack ml="auto" direction="row" gap={1.5} alignItems="center">
        <SaveEntitiesButton fromMolecularQuery entity_type="Dataset" uuids={selectedUuids} />
        <Copy />
        <BulkDownloadButtonFromSearch type="dataset" />
      </Stack>
    </Stack>
  );
}
