import React from 'react';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { Copy } from 'js/shared-styles/tables/actions';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';

export default function DatasetListHeader() {
  const selectedUuids = useSelectableTableStore((state) => state.selectedRows);
  const { sessionId } = useMolecularDataQueryFormTracking();
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle1">Datasets</Typography>
      <Stack ml="auto" direction="row" gap={1.5} alignItems="center">
        <SaveEntitiesButton
          entity_type="Dataset"
          uuids={selectedUuids}
          trackingInfo={{
            category: 'Molecular and Cellular Query',
            action: 'Results / Save Datasets',
            label: sessionId,
          }}
        />
        <Copy
          trackingInfo={{
            category: 'Molecular and Cellular Query',
            action: 'Results / Copy HuBMAP IDs',
            label: sessionId,
          }}
        />
        <BulkDownloadButtonFromSearch
          type="dataset"
          trackingInfo={{
            category: 'Molecular and Cellular Query',
            action: 'Results / Download Datasets',
            label: sessionId,
          }}
        />
      </Stack>
    </Stack>
  );
}
