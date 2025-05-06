import React, { useEffect, useMemo } from 'react';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import Stack from '@mui/material/Stack';
import CellsCharts from '../CellsCharts';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';
import { useCrossModalityResults } from './hooks';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
export default function CrossModalityGeneOrProteinResults<T extends 'gene' | 'protein'>() {
  const { data, error } = useCrossModalityResults<T>();

  const { list, isLoading } = useAugmentedResults(data?.list);

  const setResults = useResultsProvider((state) => state.setResults);

  useEffect(() => {
    if (list.length) {
      setResults(list.length, isLoading, error?.message);
    } else {
      setResults(0, false, error?.message);
    }
  }, [setResults, data, isLoading, error, list.length]);

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
    <Stack spacing={1.5} width="100%">
      <DatasetListHeader />
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
    </Stack>
  );
}
