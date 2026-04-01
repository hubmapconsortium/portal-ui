import useCellTypeNames, { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useCellTypeOntologyDetails } from 'js/hooks/useUBKG';
import { useMemo } from 'react';

export function useCellTypesList() {
  const { data, isLoading: isLoadingLabels, isValidating: isValidatingLabels } = useCellTypeNames();
  const { data: atacData, isLoading: isLoadingAtac } = useCellTypeNames('ATAC');

  const cellTypesMap = useCellTypeNamesMap();

  // Build per-modality organ maps: cellTypeName → organs[] for RNA and ATAC
  const rnaOrgansMap = useMemo(() => {
    if (!data) return {} as Record<string, string[]>;
    return data.cellTypeNames.reduce<Record<string, string[]>>((acc, raw) => {
      const [organ, cellTypeName] = raw.split('.');
      if (!acc[cellTypeName]) acc[cellTypeName] = [];
      acc[cellTypeName].push(organ);
      return acc;
    }, {});
  }, [data]);

  const atacOrgansMap = useMemo(() => {
    if (!atacData) return {} as Record<string, string[]>;
    return atacData.cellTypeNames.reduce<Record<string, string[]>>((acc, raw) => {
      const [organ, cellTypeName] = raw.split('.');
      if (!acc[cellTypeName]) acc[cellTypeName] = [];
      acc[cellTypeName].push(organ);
      return acc;
    }, {});
  }, [atacData]);

  // Build a set of ATAC cell type labels for O(1) lookup
  const atacCellTypeLabels = useMemo(() => {
    if (!atacData) return new Set<string>();
    return new Set(atacData.cellTypeNames.map(formatCellTypeName));
  }, [atacData]);

  // Combine RNA cell type names with ATAC names for a complete list to resolve CLIDs
  const allCellTypeNames = useMemo(() => {
    const rnaNames = data?.cellTypeNames ?? [];
    const atacNames = atacData?.cellTypeNames ?? [];
    // Deduplicate by raw name (organ.cellType)
    return [...new Set([...rnaNames, ...atacNames])];
  }, [data?.cellTypeNames, atacData?.cellTypeNames]);

  const { results, isLoading: isLoadingCLIDs } = useLabelsToCLIDs(allCellTypeNames);

  // Build a set of RNA cell type labels for O(1) lookup
  const rnaCellTypeLabels = useMemo(() => {
    if (!data) return new Set<string>();
    return new Set(data.cellTypeNames.map(formatCellTypeName));
  }, [data]);

  const cellTypes = useMemo(() => {
    if (!results) {
      return [];
    }
    return (
      results
        .map((clids, idx) => {
          const label = formatCellTypeName(allCellTypeNames[idx]);
          return {
            label,
            clid: clids.CLIDs?.[0],
            organs: cellTypesMap[label] ?? [],
            hasScfindRna: rnaCellTypeLabels.has(label),
            hasScfindAtac: atacCellTypeLabels.has(label),
            rnaOrgans: rnaOrgansMap[label] ?? [],
            atacOrgans: atacOrgansMap[label] ?? [],
          };
        })
        // Filter any duplicate labels (keep first)
        .filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    );
  }, [results, allCellTypeNames, cellTypesMap, rnaCellTypeLabels, atacCellTypeLabels, rnaOrgansMap, atacOrgansMap]);

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
    isLoading: isLoadingCLIDs || isLoadingLabels || isLoadingAtac || isLoadingDescriptions,
    isValidating: isValidatingLabels,
    descriptionsError,
  };
}
