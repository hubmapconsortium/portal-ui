function getMetadataFieldsSortedByEntityTypeThenFieldName(fields) {
  return Object.entries(fields)
    .sort(([fieldNameA, entityTypeA], [fieldNameB, entityTypeB]) => {
      return entityTypeA.localeCompare(entityTypeB) || fieldNameA.localeCompare(fieldNameB);
    })
    .map(([fieldName, fieldEntityType]) => ({ fieldName, fieldEntityType }));
}

function sortFieldsByConfigureGroup(fields) {
  return Object.entries(fields).sort(
    (
      [, { configureGroup: configureGroupA, label: labelA }],
      [, { configureGroup: configureGroupB, label: labelB }],
    ) => {
      // put 'General' configure group at top
      if (configureGroupA === 'General' && configureGroupB !== 'General') {
        return -1;
      }
      if (configureGroupA !== 'General' && configureGroupB === 'General') {
        return 1;
      }

      return configureGroupA.localeCompare(configureGroupB) || labelA.localeCompare(labelB);
    },
  );
}

export { getMetadataFieldsSortedByEntityTypeThenFieldName, sortFieldsByConfigureGroup };
