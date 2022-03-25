function extractAndLabelMetadata(obj, keys) {
  const labels = { mapped_organ: 'organ type', mapped_data_types: 'data type', mapped_specimen_type: 'specimen type' };
  const acc = {};
  keys.forEach((k) => {
    acc[k] = { value: k in obj ? obj[k] : undefined, label: k in labels ? labels[k] : k };
  });
  return acc;
}

function extractHeaderMetadata(assayMetadata) {
  const { hubmap_id, entity_type } = assayMetadata;

  if (entity_type === 'Dataset') {
    const {
      origin_sample: { mapped_organ },
      mapped_data_types,
    } = assayMetadata;

    return extractAndLabelMetadata({ hubmap_id, entity_type, mapped_organ, mapped_data_types }, [
      'mapped_organ',
      'mapped_data_types',
    ]);
  }
  if (entity_type === 'Sample') {
    const {
      origin_sample: { mapped_organ },
      mapped_specimen_type,
    } = assayMetadata;
    return extractAndLabelMetadata({ hubmap_id, entity_type, mapped_organ, mapped_specimen_type }, [
      'mapped_organ',
      'mapped_specimen_type',
    ]);
  }
  if (entity_type === 'Donor') {
    const { mapped_metadata = {} } = assayMetadata;
    const { sex, race, age_value, age_unit } = mapped_metadata;

    const sampleMetadata = { hubmap_id, entity_type, sex, race, age_value, age_unit };
    const donorMetadata = extractAndLabelMetadata(sampleMetadata, ['sex', 'race']);

    if ('age_value' in sampleMetadata && 'age_unit' in sampleMetadata) {
      donorMetadata.age = { value: `${sampleMetadata.age_value} ${sampleMetadata.age_unit}`, label: 'age' };
    }
    return donorMetadata;
  }

  return {};
}

export { extractHeaderMetadata };
