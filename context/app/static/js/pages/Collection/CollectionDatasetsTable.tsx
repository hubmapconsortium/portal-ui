import React, { useMemo } from 'react';

import { Entity } from 'js/components/types';
import { getIDsQuery } from 'js/helpers/queries';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { EntitiesTabTypes } from 'js/shared-styles/tables/EntitiesTable/types';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import { hubmapID, organCol, assayTypes, status as statusColumn } from 'js/shared-styles/tables/columns';

interface CollectionDatasetsTableProps {
  uuids: Set<string>;
  /** ES doc _id → retracted-first sort value (retracted = 0, others = 1). */
  retractedSortMap: Record<string, number>;
}

function CollectionDatasetsTable({ uuids, retractedSortMap }: CollectionDatasetsTableProps) {
  const entities: EntitiesTabTypes<Entity>[] = useMemo(() => {
    // The status column sorts retracted datasets first by default via client-side custom sort values.
    // Removing its ES `sort` makes the table use these values; clicking any other column header
    // switches back to standard Elasticsearch sorting, overriding the retracted-first default.
    const retractedFirstStatusColumn = {
      ...statusColumn,
      sort: undefined,
      customSortValues: retractedSortMap,
    };
    return [
      {
        entityType: 'Dataset',
        // The retracted-first default uses client-side custom sorting, which fetches all results at
        // once (no scroll pagination), so an explicit large size is required to load every dataset.
        query: { query: getIDsQuery([...uuids]), size: 10000 },
        columns: [hubmapID, organCol, assayTypes, retractedFirstStatusColumn],
        initialSortState: { columnId: 'mapped_status', direction: 'asc' },
      },
    ];
  }, [uuids, retractedSortMap]);

  return <EntitiesTables entities={entities} isSelectable={false} maxHeight={600} />;
}

export default withSelectableTableProvider(CollectionDatasetsTable, 'collection-datasets');
