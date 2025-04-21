import React, { useMemo } from 'react';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { Copy } from 'js/shared-styles/tables/actions';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import CellsCharts from '../CellsCharts';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';
import { useCrossModalityResults } from './hooks';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
export default function CrossModalityGeneOrProteinResults<T extends 'gene' | 'protein'>() {
  const { data } = useCrossModalityResults<T>();

  const { list, isLoading } = useAugmentedResults(data?.list);

  const selectedUuids = useSelectableTableStore((state) => state.selectedRows);

  const query = useMemo(() => {
    const ids = { values: list.map((r) => r._source.uuid) };
    return {
      query: { ids },
      size: 10000,
      _source: [
        'hubmap_id',
        'origin_samples_unique_mapped_organs',
        'mapped_status',
        'mapped_data_types',
        'mapped_data_access_level',
        'uuid',
        'last_modified_timestamp',
      ],
    };
  }, [list]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle1">Datasets</Typography>
        <Stack ml="auto" direction="row" gap={1.5} alignItems="center">
          <SaveEntitiesButton fromMolecularQuery entity_type="Dataset" uuids={selectedUuids} />
          <Copy />
          <BulkDownloadButtonFromSearch type="dataset" />
        </Stack>
      </Stack>
      <EntitiesTables
        maxHeight={800}
        isSelectable
        entities={[
          {
            entityType: 'Dataset',
            query,
            columns,
            expandedContent: CellsCharts,
          },
        ]}
      />
    </div>
  );
}
