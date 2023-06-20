export const getAllCollectionsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Collection' } },
  size: 10000,
};

export function getIDsQuery(ids) {
  return {
    ids: {
      values: ids,
    },
  };
}

export const excludeSupportEntitiesClause = {
  bool: {
    must_not: {
      term: {
        'entity_type.keyword': 'Support',
      },
    },
  },
};

export const includeOnlyDatasetsClause = {
  bool: {
    must: {
      term: {
        'entity_type.keyword': 'Dataset',
      },
    },
  },
};

export function getAncestorsQuery(descendantUUID) {
  return {
    bool: {
      filter: [
        {
          term: {
            descendant_ids: descendantUUID,
          },
        },
      ],
    },
  };
}
