import { produce } from 'immer';

function getMatchingTerms(aggsData, searchTerm) {
  return Object.entries(aggsData.aggregations).reduce((acc, [k, v]) => {
    return produce(acc, (draft) => {
      const matches = v.buckets.filter((b) => b.key.toLowerCase().includes(searchTerm.toLowerCase()));
      if (matches.length > 0) {
        // eslint-disable-next-line no-param-reassign
        draft[k] = matches;
      }
    });
  }, {});
}

function getAggsObject(aggsField, fieldSize) {
  return {
    terms: {
      field: `${aggsField}.keyword`,
      size: fieldSize,
    },
  };
}

function getAggsQuery(entityType, aggsFields, fieldSize) {
  const aggs = {};
  aggsFields.forEach((aggsField) => {
    aggs[aggsField] = getAggsObject(aggsField, fieldSize);
  });
  return {
    query: {
      bool: {
        filter: {
          term: {
            entity_type: entityType,
          },
        },
      },
    },
    size: 0,
    aggs,
  };
}

export { getMatchingTerms, getAggsQuery };
