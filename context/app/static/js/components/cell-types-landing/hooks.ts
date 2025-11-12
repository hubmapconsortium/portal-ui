import useCellTypeNames, { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useCellTypeOntologyDetails } from 'js/hooks/useUBKG';
import { useMemo } from 'react';

export function useCellTypesList() {
  const { data, isLoading: isLoadingLabels, isValidating: isValidatingLabels } = useCellTypeNames();

  const cellTypesMap = useCellTypeNamesMap();

  const { results, isLoading: isLoadingCLIDs } = useLabelsToCLIDs(data?.cellTypeNames ?? []);

  const cellTypes = useMemo(() => {
    if (!results) {
      return [];
    }
    const cellTypeLabels = data?.cellTypeNames ?? [];
    return (
      results
        .map((clids, idx) => {
          const label = formatCellTypeName(cellTypeLabels[idx]);
          return {
            label,
            clid: clids.CLIDs?.[0],
            organs: cellTypesMap[label] ?? [],
          };
        })
        // Filter any duplicate labels (keep first)
        .filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    );
  }, [results, data?.cellTypeNames, cellTypesMap]);

  // Fetch cell type descriptions using the UBKG API
  const {
    data: cellTypeDetails,
    isLoading: isLoadingDescriptions,
    error: descriptionsError,
  } = useCellTypeOntologyDetails(cellTypes.map((ct) => ct.clid).filter(Boolean));

  // Combine cell types with their descriptions
  const cellTypesWithDescriptions = useMemo(() => {
    return cellTypes.map((cellType) => ({
      ...cellType,
      description: cellType.clid ? cellTypeDetails?.[cellType.clid.replace(/\D/g, '')]?.definition : undefined,
    }));
  }, [cellTypes, cellTypeDetails]);

  return {
    cellTypes: cellTypesWithDescriptions,
    isLoading: isLoadingCLIDs || isLoadingLabels || isLoadingDescriptions,
    isValidating: isValidatingLabels,
    descriptionsError,
  };
}
