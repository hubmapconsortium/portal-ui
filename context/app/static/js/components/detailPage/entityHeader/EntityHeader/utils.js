function extractAndLabelMetadata(obj, keys) {
  const labels = { mapped_organ: 'organ type', mapped_data_types: 'data type', mapped_specimen_type: 'specimen type' };
  const acc = {};
  keys.forEach((k) => {
    acc[k] = { value: k in obj ? obj[k] : undefined, label: k in labels ? labels[k] : k };
  });
  return acc;
}

function extractHeaderMetadata(assayMetadata, entity_type) {
  if (entity_type === 'Dataset') {
    return extractAndLabelMetadata(assayMetadata, ['mapped_organ', 'mapped_data_types']);
  }
  if (entity_type === 'Sample') {
    return extractAndLabelMetadata(assayMetadata, ['mapped_organ', 'mapped_specimen_type']);
  }
  if (entity_type === 'Donor') {
    const donorMetadata = extractAndLabelMetadata(assayMetadata, ['sex']);
    donorMetadata.race = { value: (assayMetadata.race || []).join(', '), label: 'race' };
    if ('age_value' in assayMetadata && 'age_unit' in assayMetadata) {
      donorMetadata.age = { value: `${assayMetadata.age_value} ${assayMetadata.age_unit}`, label: 'age' };
    }
    return donorMetadata;
  }

  return {};
}

export { extractHeaderMetadata };
