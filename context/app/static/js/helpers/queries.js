export const getAllCollectionsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Collection' } },
  size: 10000,
};
