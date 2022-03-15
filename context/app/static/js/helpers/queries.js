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

export const mustNotSupportQueryClause = {
  bool: {
    must_not: {
      term: {
        'entity_type.keyword': 'Support',
      },
    },
  },
};
