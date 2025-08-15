// NOTE: This is the dev endpoint. We can't use flaskdata to provide this in Storybook because it doesn't exist in the Storybook environment.
export const SCFIND_BASE_STORYBOOK = 'https://scfind.dev.hubmapconsortium.org';

/**
 * Helper method to form URLs for SCFind API requests
 *
 * @param scFindApiUrl - The base URL for the SCFind API
 * @param endpoint - The endpoint to hit
 * @param params - The parameters to include in the URL
 */
export function createScFindKey(
  scFindApiUrl: string,
  endpoint: string,
  params: Record<string, string | undefined>,
  indexVersion?: string,
): string {
  const urlParams = new URLSearchParams();
  // Filter out undefined values from url params
  Object.entries(params)
    .filter(([, value]) => value)
    .forEach(([key, value]) => urlParams.append(key, value!));

  if (indexVersion) {
    urlParams.append('index_version', indexVersion);
  }
  const fullUrl = new URL(`${scFindApiUrl}/api/${endpoint}?${urlParams.toString()}`);
  return fullUrl.toString();
}

/**
 * Removes the organ prefix from a cell type name.
 * This is useful for displaying cell types without the organ context.
 * @param cellType - The cell type string, which may include an organ prefix (e.g., "organ.cellType").
 * @returns The formatted cell type name without the organ prefix (e.g., "cellType").
 */
export function formatCellTypeName(cellType: string): string {
  if (cellType.includes('.')) {
    // Remove the organ prefix from the cell type name
    return cellType.split('.')[1];
  }
  return cellType;
}

/**
 * Extracts information from a cell type string.
 * @param cellType - The cell type string (e.g., "organ.cellType:variant").
 * @returns An object containing the organ, name, and variant of the cell type.
 */
export function extractCellTypeInfo(cellType: string) {
  if (!cellType) {
    return { organ: '', name: '', variant: undefined };
  }
  if (!cellType.includes('.')) {
    // If there's no organ prefix, treat the whole string as the name
    if (cellType.includes(':')) {
      const [name, variant] = cellType.split(':');
      return { organ: '', name, variant };
    }
    return { organ: '', name: cellType, variant: undefined };
  }
  const [organ, typeWithVariant] = cellType.split('.');
  const [name, variant] = typeWithVariant.split(':');
  return { organ, name, variant };
}

/**
 * Extracts cell type information from an array of cell types.
 * This function processes a list of cell types, extracting the name, organs, and variants.
 * It assumes that the cell types are formatted as `<organ>.<cell_type>:<variant>`.
 * If the list is empty, it returns an object with empty values.
 * @param cellTypes - An array of cell type strings, each formatted as `<organ>.<cell_type>:<variant>`.
 * @returns An object containing the names, organs, and variants of the cell types.
 */
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

export function stringIsCellType(cellType: string): boolean {
  // A cell type is a string that contains a dot (.) and optionally a colon (:)
  return cellType.includes('.') || cellType.includes(':');
}
