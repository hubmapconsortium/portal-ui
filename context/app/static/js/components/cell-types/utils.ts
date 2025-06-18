export function extractCellTypeInfo(cellType: string) {
  if (!cellType) {
    return { organ: '', name: '', variant: undefined };
  }
  const [organ, typeWithVariant] = cellType.split('.');
  const [name, variant] = typeWithVariant.split(':');
  return { organ, name, variant };
}

export function extractCellTypesInfo(cellTypes: string[]) {
  if (!cellTypes || cellTypes.length === 0) {
    return {
      name: '',
      organs: [],
      variants: {},
    };
  }
  const cellTypeName = cellTypes[0].split(':')[0].split('.')[1];
  const organs = cellTypes.map((cellType) => cellType.split('.')[0]);
  const variants: Record<string, string[]> = {};
  // ensure that each organ has an entry in the variants object
  // and collect unique variants for each organ
  cellTypes.forEach((cellType) => {
    const [organ, typeWithVariant] = cellType.split('.');
    const [, variant] = typeWithVariant.split(':');
    if (!variants[organ]) {
      variants[organ] = [];
    }
    if (variant && !variants[organ].includes(variant)) {
      variants[organ].push(variant);
    }
  });

  return {
    name: cellTypeName,
    organs: Array.from(new Set(organs)), // Ensure unique organs
    variants,
  };
}
