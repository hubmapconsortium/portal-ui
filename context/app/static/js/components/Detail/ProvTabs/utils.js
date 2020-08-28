export function checkDataTypesForValues(dataTypes, valuesToCheck) {
  return dataTypes.some((type) => valuesToCheck.some((value) => type === value));
}
