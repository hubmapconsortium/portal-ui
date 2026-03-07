import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { getAncestorsQuery, getIDsQuery } from 'js/helpers/queries';

function getAggsClause(aggsField: string) {
  return {
    aggs: {
      [aggsField]: {
        terms: {
          field: `${aggsField}.keyword`,
          size: 10000,
        },
      },
    },
    size: 0,
  };
}

function getCollectionDatasetsQuery(collectionUUID: string) {
  return {
    query: getIDsQuery(collectionUUID),
    _source: 'datasets.uuid',
    size: 10000,
  };
}

interface UsePublicationDatasetsAggsParams {
  descendantUUID: string;
  aggsField: string;
  associatedCollectionUUID?: string;
}

function usePublicationDatasetsAggs({
  descendantUUID,
  aggsField,
  associatedCollectionUUID,
}: UsePublicationDatasetsAggsParams) {
  const { searchHits: collectionDatasets } = useSearchHits(getCollectionDatasetsQuery(associatedCollectionUUID ?? ''));

  const collectionDatasetsUUIDs =
    collectionDatasets.length > 0
      ? ((collectionDatasets[0]?._source as { datasets?: { uuid: string }[] })?.datasets?.map(({ uuid }) => uuid) ?? [])
      : [];

  const query = associatedCollectionUUID
    ? {
        query: getIDsQuery(collectionDatasetsUUIDs),
        ...getAggsClause(aggsField),
      }
    : {
        query: getAncestorsQuery(descendantUUID),
        ...getAggsClause(aggsField),
      };

  return useSearchData(query, {
    useDefaultQuery: false,
  });
}

export { usePublicationDatasetsAggs };
