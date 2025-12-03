export function hasDataTypes<T>(dataTypes: T[], typesToCheck: T[]) {
  if (!dataTypes) {
    return false;
  }

  return dataTypes.some((type) => typesToCheck.some((value) => type === value));
}
