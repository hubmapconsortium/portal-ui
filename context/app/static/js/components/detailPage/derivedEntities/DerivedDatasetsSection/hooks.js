import { useDerivedDatasetSearchHits } from 'js/hooks/useDerivedEntitySearchHits';
import { derivedDatasetsColumns } from 'js/components/detailPage/derivedEntities/columns';

function useDerivedDatasetsSection(uuid) {
  const { searchHits: datasets, isLoading } = useDerivedDatasetSearchHits(uuid);

  const entities = [
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
      columns: derivedDatasetsColumns,
    },
  ];

  return { entities, isLoading };
}

export { useDerivedDatasetsSection };
