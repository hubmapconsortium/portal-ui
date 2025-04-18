import React, { useMemo } from 'react';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import { useCrossModalityResults } from './hooks';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';
import CellsCharts from '../CellsCharts';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
export default function CrossModalityGeneOrProteinResults<T extends 'gene' | 'protein'>() {
  const { data } = useCrossModalityResults<T>();

  const { list, isLoading } = useAugmentedResults(data?.list);

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
  );
}
