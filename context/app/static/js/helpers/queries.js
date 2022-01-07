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
