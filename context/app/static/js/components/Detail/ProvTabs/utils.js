export function checkDataTypesForValues(dataTypes, valuesToCheck) {
  return (
    dataTypes.filter(
      (type) => valuesToCheck.filter((value) => type.toLowerCase().includes(value.toLowerCase())).length > 0,
    ).length > 0
  );
}

export function getTabIndex(defaultIndex, shouldDisplayTable) {
  return shouldDisplayTable ? defaultIndex : defaultIndex - 1;
}
