import useCellTypeNames, { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useMemo } from 'react';

export function useCellTypesList() {
  const { data, isLoading: isLoadingLabels, isValidating: isValidatingLabels } = useCellTypeNames();

  const cellTypeLabels = useMemo(() => data?.cellTypeNames ?? [], [data]);

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
    const formattedLabelsAndCLIDs = cellTypeCLIDs
      .map((clids, idx) => ({
        label: formatCellTypeName(cellTypeLabels[idx]),
        clid: clids.CLIDs?.[0],
      }))
      // Filter any duplicate labels (keep first)
      .filter((item, index, self) => index === self.findIndex((t) => t.label === item.label));

    return formattedLabelsAndCLIDs.map(({ label, clid }) => {
      return {
        label,
        organs: cellTypesMap[label] ?? [],
        clid,
      };
    });
  }, [cellTypeCLIDs, cellTypeLabels, cellTypesMap]);

  return {
    cellTypes,
    isLoading: isLoadingCLIDs || isLoadingLabels,
    isValidating: isValidatingCLIDs || isValidatingLabels,
  };
}
