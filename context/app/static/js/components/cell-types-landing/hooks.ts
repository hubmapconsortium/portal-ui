import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useMemo } from 'react';
import { useCellTypesLandingDataContext } from './CellTypesLandingDataContext';

export function useCellTypesList() {
  // RNA + ATAC cell type names, dataset counts, and descriptions all come from the page aggregate
  // (one request, warmed server-side).
  const {
    cellTypeNames,
    cellTypeNamesAtac,
    datasetCounts,
    descriptions,
    isLoading: isLoadingLanding,
    isValidating: isValidatingLanding,
  } = useCellTypesLandingDataContext();

  // Build per-modality organ maps: cellTypeName → organs[] for RNA and ATAC
  const rnaOrgansMap = useMemo(() => {
    return cellTypeNames.reduce<Record<string, string[]>>((acc, raw) => {
      const [organ, cellTypeName] = raw.split('.');
      if (!acc[cellTypeName]) acc[cellTypeName] = [];
      acc[cellTypeName].push(organ);
      return acc;
    }, {});
  }, [cellTypeNames]);

  const atacOrgansMap = useMemo(() => {
    return cellTypeNamesAtac.reduce<Record<string, string[]>>((acc, raw) => {
      const [organ, cellTypeName] = raw.split('.');
      if (!acc[cellTypeName]) acc[cellTypeName] = [];
      acc[cellTypeName].push(organ);
      return acc;
    }, {});
  }, [cellTypeNamesAtac]);

  // Build a set of ATAC cell type labels for O(1) lookup
  const atacCellTypeLabels = useMemo(() => new Set(cellTypeNamesAtac.map(formatCellTypeName)), [cellTypeNamesAtac]);

  // Combine RNA cell type names with ATAC names for a complete list to resolve CLIDs
  const allCellTypeNames = useMemo(
    // Deduplicate by raw name (organ.cellType)
    () => [...new Set([...cellTypeNames, ...cellTypeNamesAtac])],
    [cellTypeNames, cellTypeNamesAtac],
  );

  const { results, isLoading: isLoadingCLIDs } = useLabelsToCLIDs(allCellTypeNames);

  // Build a set of RNA cell type labels for O(1) lookup
  const rnaCellTypeLabels = useMemo(() => new Set(cellTypeNames.map(formatCellTypeName)), [cellTypeNames]);

  const cellTypes = useMemo(() => {
    if (!results) {
      return [];
    }
    return (
      results
        .map((clids, idx) => {
          const label = formatCellTypeName(allCellTypeNames[idx]);
          const rnaOrgans = rnaOrgansMap[label] ?? [];
          const atacOrgans = atacOrgansMap[label] ?? [];
          return {
            label,
            clid: clids.CLIDs?.[0],
            // Unified organ list across modalities (drives both display and the organ filter).
            organs: [...new Set([...rnaOrgans, ...atacOrgans])],
            // Per-modality organ lists so each Data Type chip queries only the organs that actually
            // have this cell type for that modality (rather than the unified set).
            rnaOrgans,
            atacOrgans,
            hasScfindRna: rnaCellTypeLabels.has(label),
            hasScfindAtac: atacCellTypeLabels.has(label),
            rnaDatasetCount: datasetCounts[label]?.rna ?? 0,
            atacDatasetCount: datasetCounts[label]?.atac ?? 0,
          };
        })
        // Filter any duplicate labels (keep first)
        .filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    );
  }, [results, allCellTypeNames, rnaOrgansMap, rnaCellTypeLabels, atacCellTypeLabels, atacOrgansMap, datasetCounts]);

  // Combine cell types with their descriptions (cached in the aggregate, keyed by full CLID).
  const cellTypesWithDescriptions = useMemo(() => {
    return cellTypes.map((cellType) => ({
      ...cellType,
      description: cellType.clid ? descriptions[cellType.clid] : undefined,
    }));
  }, [cellTypes, descriptions]);

  return {
    cellTypes: cellTypesWithDescriptions,
    isLoading: isLoadingCLIDs || isLoadingLanding,
    isValidating: isValidatingLanding,
  };
}
