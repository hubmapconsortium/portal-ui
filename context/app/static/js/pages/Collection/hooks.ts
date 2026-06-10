import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { Dataset } from 'js/components/types';
import { isRetractedStatus } from 'js/components/detailPage/utils';

interface CollectionDatasetsHook {
  ids: string[];
}

function useCollectionsDatasets({ ids }: CollectionDatasetsHook) {
  const query = {
    query: {
      ...getIDsQuery(ids),
    },
    _source: ['hubmap_id', 'entity_type', 'uuid', 'mapped_status', 'status'],
    size: 10000,
  };

  const { searchHits: datasets } = useSearchHits<Dataset>(query);
  const uuids = useMemo(() => new Set(datasets.map((dataset) => dataset._source.uuid)), [datasets]);

  // Maps each dataset's ES doc _id to a retracted-first sort value (retracted = 0 sorts before
  // non-retracted = 1). The sortable datasets table consumes this as client-side custom sort values.
  const retractedSortMap = useMemo(
    () =>
      Object.fromEntries(
        datasets.map((d) => [d._id, isRetractedStatus(d._source.mapped_status ?? d._source.status) ? 0 : 1]),
      ),
    [datasets],
  );

  const hasRetracted = useMemo(
    () => datasets.some((d) => isRetractedStatus(d._source.mapped_status ?? d._source.status)),
    [datasets],
  );

  return { datasets, uuids, retractedSortMap, hasRetracted };
}

export { useCollectionsDatasets };
