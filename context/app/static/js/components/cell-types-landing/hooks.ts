import useCellTypeNames, { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useMemo } from 'react';

export function useCellTypesList() {
  const { data, isLoading: isLoadingLabels, isValidating: isValidatingLabels } = useCellTypeNames();

  const cellTypesMap = useCellTypeNamesMap();

  const {
    data: cellTypeCLIDs,
    isLoading: isLoadingCLIDs,
    isValidating: isValidatingCLIDs,
  } = useLabelsToCLIDs(data?.cellTypeNames ?? []);

  const cellTypes = useMemo(() => {
    if (!cellTypeCLIDs) {
      return [];
    }
    const cellTypeLabels = data?.cellTypeNames ?? [];
    return (
      cellTypeCLIDs
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
  }, [cellTypeCLIDs, data?.cellTypeNames, cellTypesMap]);

  return {
    cellTypes,
    isLoading: isLoadingCLIDs || isLoadingLabels,
    isValidating: isValidatingCLIDs || isValidatingLabels,
  };
}
