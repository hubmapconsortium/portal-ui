function buildSortPairs(fields) {
  return fields
    .map(({ field, label }) => [
      {
        id: `${field}.asc`,
        label,
        field: { [field]: 'asc' },
      },
      {
        id: `${field}.desc`,
        label,
        field: { [field]: 'desc' },
      },
    ])
    .flat();
}

function getNumericFacetProps(fieldName, numericFacetsProps) {
  if (!numericFacetsProps?.[fieldName]) {
    return {};
  }

  return { range: numericFacetsProps[fieldName] };
}

export { buildSortPairs, getNumericFacetProps };
