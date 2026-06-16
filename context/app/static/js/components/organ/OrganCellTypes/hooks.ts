import { useMemo } from 'react';

import { percent } from 'js/helpers/number-format';
import { useIndexedDatasetsForCurrentOrgan } from 'js/pages/Organ/hooks';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { useOrganCellTypesByModality } from './OrganCellTypesContext';

/**
 * Builds the cell-types table rows for a modality from the server-side organ aggregate, joining the
 * per-cell-type matched datasets / CLID / description with the per-modality "total indexed datasets"
 * denominator (still derived client-side, since it requires crossing scFind with Elasticsearch for
 * organ scoping).
 */
export function useCellTypeRows(modality?: SCFindModality) {
  const { cellTypes, isLoading } = useOrganCellTypesByModality(modality);
  const { datasets: totalIndexedDatasets, isLoadingDatasets } = useIndexedDatasetsForCurrentOrgan(modality);

  const rows = useMemo(
    () =>
      cellTypes
        // Hide the "other" cell type annotation (also excluded server-side; belt and suspenders).
        .filter((cellType) => cellType.name.toLowerCase() !== 'other')
        .map((cellType) => {
          const matchedDatasets = cellType.datasets;
          const percentage = percent.format(matchedDatasets.length / totalIndexedDatasets.length);
          return {
            cellType: cellType.name,
            clid: cellType.clid,
            matchedDatasets,
            totalIndexedDatasets: totalIndexedDatasets.length,
            percentage,
            description: cellType.description ?? '',
          };
        }),
    [cellTypes, totalIndexedDatasets.length],
  );

  return {
    rows,
    isLoading: isLoading || isLoadingDatasets,
    isLoadingDescriptions: isLoading,
  };
}
