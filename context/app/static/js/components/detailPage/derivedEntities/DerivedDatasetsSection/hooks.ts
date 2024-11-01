import { useDerivedDatasetSearchHits } from 'js/hooks/useDerivedEntitySearchHits';
import { derivedDatasetsColumns } from 'js/components/detailPage/derivedEntities/columns';

function useDerivedDatasetsSection(uuid: string) {
  const { searchHits: datasets, isLoading } = useDerivedDatasetSearchHits(uuid);

  const mappedDatasets = datasets.map((dataset) => dataset._source);

  const entities = [
    {
      entityType: 'Dataset' as const,
      tabLabel: 'Datasets',
      data: datasets,
      columns: derivedDatasetsColumns,
    },
  ];

  return { entities, datasets: mappedDatasets, isLoading };
}

export { useDerivedDatasetsSection };
