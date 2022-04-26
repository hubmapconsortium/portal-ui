function getMetadataFieldsSortedByEntityTypeThenFieldName(fields) {
  return Object.entries(fields)
    .sort(([fieldNameA, entityTypeA], [fieldNameB, entityTypeB]) => {
      return entityTypeA.localeCompare(entityTypeB) || fieldNameA.localeCompare(fieldNameB);
    })
    .map(([fieldName, fieldEntityType]) => ({ fieldName, fieldEntityType }));
}

export { getMetadataFieldsSortedByEntityTypeThenFieldName };
