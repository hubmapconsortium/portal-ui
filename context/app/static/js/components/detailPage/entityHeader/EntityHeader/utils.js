function extractAndLabelMetadata(obj, keys) {
  const labels = { mapped_organ: 'organ type', mapped_data_types: 'data type', mapped_specimen_type: 'specimen type' };
  const acc = {};
  keys.forEach((k) => {
    acc[k] = { value: k in obj ? obj[k] : undefined, label: k in labels ? labels[k] : k };
  });
  return acc;
}

function extractHeaderMetadata({
  entity_type,
  mapped_data_types,
  mapped_specimen_type,
  mapped_metadata: { sex, race, age_value, age_unit } = {},
  origin_sample: { mapped_organ } = {},
}) {
  if (entity_type === 'Dataset') {
    return extractAndLabelMetadata({ mapped_organ, mapped_data_types }, ['mapped_organ', 'mapped_data_types']);
  }

  if (entity_type === 'Sample') {
    return extractAndLabelMetadata({ mapped_organ, mapped_specimen_type }, ['mapped_organ', 'mapped_specimen_type']);
  }

  if (entity_type === 'Donor') {
    const age = age_value && age_unit ? `${age_value} ${age_unit}` : undefined;
    return extractAndLabelMetadata({ sex, race, age }, ['sex', 'race', 'age']);
  }

  return {};
}

export { extractHeaderMetadata };
