function getMappedDataTypesParams(mappedDataTypes) {
  const queryParams = mappedDataTypes.map(
    (mappedDataType, i) => `&mapped_data_types[${i}]=${encodeURIComponent(mappedDataType)}`,
  );
  return queryParams.join('');
}

export { getMappedDataTypesParams };
