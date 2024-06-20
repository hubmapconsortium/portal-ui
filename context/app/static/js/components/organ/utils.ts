interface SearchURLTypes {
  entityType: string;
  organTerms: string[];
  assay?: string;
  mappedAssay?: string;
  assayTypeMap?: Record<string, string[]>;
  donorRace?: string;
  donorSex?: string;
  processingStatus?: string;
}

function getSearchURL({
  entityType,
  organTerms,
  assay,
  mappedAssay,
  assayTypeMap,
  donorRace,
  donorSex,
  processingStatus,
}: SearchURLTypes) {
  const query = new URLSearchParams();
  query.set('entity_type[0]', entityType);
  organTerms.forEach((term, i) => {
    query.set(`origin_samples.mapped_organ[${i}]`, term);
  });
  if (donorRace) {
    query.set('donor.mapped_metadata.race[0]', donorRace);
  }
  if (donorSex) {
    query.set('donor.mapped_metadata.sex[0]', donorSex);
  }
  if (processingStatus) {
    query.set('processing[0]', processingStatus);
  }

  if (assayTypeMap) {
    if (assay) {
      const mappedDatasetTypes = assayTypeMap[assay] ?? [];

      mappedDatasetTypes.forEach((datasetType, idx) => {
        query.set(`raw_dataset_type_keyword-assay_display_name_keyword[${assay}][${idx}]`, datasetType);
      });
    } else if (mappedAssay) {
      const parentAssay = Object.keys(assayTypeMap).find((key) => assayTypeMap[key].includes(mappedAssay));
      query.set(`raw_dataset_type_keyword-assay_display_name_keyword[${parentAssay}][${0}]`, mappedAssay);
    }
  }

  return `/search?${query.toString()}`;
}

export { getSearchURL };
