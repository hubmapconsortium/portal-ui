/**
 * Get the unique cell type categories
 * if we have "Lung.B cells" and "Lung.T cells", `lung` should be a category
 * if we have "Lung.B cells" and "Liver.B cells", `B cells` should be a category
 * Each individual cell type should also be a category
 * @param cellTypes
 * @returns {string[]}
 */
export function categorizeCellTypes(cellTypes: string[]) {
  const cellTypeCategories: Record<string, number> = {};
  cellTypes.forEach((cellType) => {
    // Add the cell type itself to the categories with a weight of 2 to ensure it is included
    cellTypeCategories[cellType] = 2;

    // Add the organ and cell type to categories with a weight of 1
    const cellTypeParts = cellType.split('.');
    // This will add `Lung` and `B cells` to the unique cell type categories
    // if there are multiple cell types for the same organ or cell type
    cellTypeParts.forEach((part) => {
      cellTypeCategories[part] = (cellTypeCategories[part] || 0) + 1;
    });
  });
  // Remove categories with a weight of 1 (i.e. those that are not shared between cell types)
  return Object.entries(cellTypeCategories)
    .filter(([, weight]) => weight > 1)
    .map(([cellType]) => cellType);
}
