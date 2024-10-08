import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { organCol, dataTypesCol, statusCol } from 'js/components/detailPage/derivedEntities/columns';
import { Dataset } from 'js/components/types';
import { RelatedEntitiesColumn } from 'js/components/detailPage/related-entities/RelatedEntitiesTable/RelatedEntitiesTable';

const columns = [organCol, dataTypesCol, statusCol] as RelatedEntitiesColumn[];

interface CollectionDatasetsHook {
  ids: string[];
}

function useCollectionsDatasets({ ids }: CollectionDatasetsHook) {
  const query = {
    query: {
      ...getIDsQuery(ids),
    },
    _source: ['hubmap_id', 'entity_type', 'uuid', ...columns.map((c) => c.id)],
    size: 10000,
  };

  const { searchHits: datasets } = useSearchHits<Dataset>(query);
  return { columns, datasets };
}

export { useCollectionsDatasets };
