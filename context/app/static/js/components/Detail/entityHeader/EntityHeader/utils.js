const extractValuesFromObject = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (k in obj) {
      acc.push(obj[k]);
    }
    return acc;
  }, []);

function extractHeaderMetadata(assayMetadata, entity_type) {
  if (!entity_type) return [];

  if (entity_type === 'Dataset') {
    return extractValuesFromObject(assayMetadata, ['mapped_organ', 'mapped_data_types']);
  }
  if (entity_type === 'Sample') {
    return extractValuesFromObject(assayMetadata, ['mapped_organ', 'mapped_specimen_type']);
  }
  if (entity_type === 'Donor') {
    const donorMetadata = extractValuesFromObject(assayMetadata, ['sex', 'race']);
    if ('age_value' in assayMetadata && 'age_unit' in assayMetadata) {
      donorMetadata.push(`${assayMetadata.age_value} ${assayMetadata.age_unit}`);
    }
    return donorMetadata;
  }

  return [];
}

export { extractHeaderMetadata };
