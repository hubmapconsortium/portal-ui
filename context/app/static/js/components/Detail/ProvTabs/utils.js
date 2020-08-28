export function checkDataTypesForValues(dataTypes, valuesToCheck) {
  if (!dataTypes) {
    return false;
  }

  return dataTypes.some((type) => valuesToCheck.some((value) => type === value));
}
