import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { getAncestorsQuery, getIDsQuery } from 'js/helpers/queries';

function getAggsClause(aggsField) {
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

function getCollectionDatasetsQuery(collectionUUID) {
  return {
    query: getIDsQuery(collectionUUID),
    _source: 'datasets.uuid',
    size: 10000,
  };
}

function usePublicationDatasetsAggs({ descendantUUID, aggsField, associatedCollectionUUID }) {
  const { searchHits: collectionDatasets } = useSearchHits(getCollectionDatasetsQuery(associatedCollectionUUID));

  const collectionDatasetsUUIDs =
    collectionDatasets.length > 0 ? collectionDatasets[0]?._source?.datasets.map(({ uuid }) => uuid) : [];

  const query = associatedCollectionUUID
    ? {
        query: getIDsQuery(collectionDatasetsUUIDs),
        ...getAggsClause(aggsField),
      }
    : {
        query: getAncestorsQuery(descendantUUID, 'dataset'),
        ...getAggsClause(aggsField),
      };

  return useSearchData(query);
}

export { usePublicationDatasetsAggs };
