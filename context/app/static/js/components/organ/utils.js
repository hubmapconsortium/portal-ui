function getSearchURL(entityType, searchTerms) {
  const query = new URLSearchParams();
  query.set('entity_type[0]', entityType);
  searchTerms.forEach((term, i) => {
    query.set(`origin_sample.mapped_organ[${i}]`, term);
  });
  return `/search?${query}`;
}

export { getSearchURL };
