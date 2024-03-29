interface SearchURLTypes {
  entityType: string;
  organTerms: string[];
  assay?: string;
}

function getSearchURL({ entityType, organTerms, assay }: SearchURLTypes) {
  const query = new URLSearchParams();
  query.set('entity_type[0]', entityType);
  organTerms.forEach((term, i) => {
    query.set(`origin_samples.mapped_organ[${i}]`, term);
  });
  if (assay) {
    query.set('mapped_data_types[0]', assay);
  }
  return `/search?${query.toString()}`;
}

export { getSearchURL };
