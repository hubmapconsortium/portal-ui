export function hasDataTypes(dataTypes, typesToCheck) {
  if (!dataTypes) {
    return false;
  }

  return dataTypes.some((type) => typesToCheck.some((value) => type === value));
}
