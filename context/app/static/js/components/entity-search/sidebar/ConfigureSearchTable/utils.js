function excludeDateFieldConfigs(fieldConfigEntries) {
  const excludedFieldTypes = ['date', 'datetime'];

  return fieldConfigEntries.filter(([, fieldConfig]) => !excludedFieldTypes.includes(fieldConfig.type));
}

function getFieldEntriesSortedByConfigureGroup(fields) {
  return Object.entries(fields).sort(
    (
      [, { configureGroup: configureGroupA, label: labelA }],
      [, { configureGroup: configureGroupB, label: labelB }],
    ) => {
      // Sort 'General' configure group to top:
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

export { excludeDateFieldConfigs, getFieldEntriesSortedByConfigureGroup };
