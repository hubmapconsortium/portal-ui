import React from 'react';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { Copy } from 'js/shared-styles/tables/actions';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';

const categoryTrackingMapping = {
  'Molecular and Cellular Query': {
    save: 'Results / Save Datasets',
    copy: 'Results / Copy HuBMAP IDs',
    download: 'Results / Download Datasets',
  },
  'Gene Detail Page': {
    save: 'Datasets / Results / Save Results to List',
    copy: 'Datasets / Results / Copy Gene IDs',
    download: 'Datasets / Results / Download Gene Details',
  },
};

const useDatasetListHeaderTracking = () => {
  const { category, label } = useMolecularDataQueryFormTracking();

  return {
    category,
    save: categoryTrackingMapping[category]?.save || 'Results / Save Datasets',
    copy: categoryTrackingMapping[category]?.copy || 'Results / Copy HuBMAP IDs',
    download: categoryTrackingMapping[category]?.download || 'Results / Download Datasets',
    label,
  };
};

export default function DatasetListHeader() {
  const selectedUuids = useSelectableTableStore((state) => state.selectedRows);
  const { category, save, copy, download, label } = useDatasetListHeaderTracking();
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle1">Datasets</Typography>
      <Stack ml="auto" direction="row" gap={1.5} alignItems="center">
        <SaveEntitiesButton
          entity_type="Dataset"
          uuids={selectedUuids}
          trackingInfo={{
            category,
            action: save,
            label,
          }}
        />
        <Copy
          trackingInfo={{
            category,
            action: copy,
            label,
          }}
        />
        <BulkDownloadButtonFromSearch
          type="dataset"
          trackingInfo={{
            category,
            action: download,
            label,
          }}
        />
      </Stack>
    </Stack>
  );
}
