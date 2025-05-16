import React, { useEffect, useMemo } from 'react';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import Stack from '@mui/material/Stack';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import CellsCharts from '../CellsCharts';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';
import { useCrossModalityResults } from './hooks';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
export default function CrossModalityGeneOrProteinResults<T extends 'gene' | 'protein'>() {
  const { data, error, isLoading: isLoadingInitialResults } = useCrossModalityResults<T>();

  const { list, isLoading: isLoadingAugmentedResults } = useAugmentedResults(data?.list);

  const isLoading = isLoadingInitialResults || isLoadingAugmentedResults;

  const setResults = useResultsProvider((state) => state.setResults);

  useEffect(() => {
    if (list.length > 0) {
      setResults(list.length, false, null);
    } else {
      setResults(0, isLoading, error);
    }
  }, [setResults, data, isLoading, error, list]);

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
      <EntityTable maxHeight={800} isSelectable query={query} columns={columns} expandedContent={CellsCharts} />
    </Stack>
  );
}
