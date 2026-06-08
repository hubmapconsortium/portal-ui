import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useCellTypeOntologyDetails } from 'js/hooks/useUBKG';
import { useMemo } from 'react';
import { useCellTypesLandingDataContext } from './CellTypesLandingDataContext';

export function useCellTypesList() {
  // RNA + ATAC cell type names come from the page aggregate (one request, warmed server-side).
  const {
    cellTypeNames,
    cellTypeNamesAtac,
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
          return {
            label,
            clid: clids.CLIDs?.[0],
            organs: rnaOrgansMap[label] ?? [],
            hasScfindRna: rnaCellTypeLabels.has(label),
            hasScfindAtac: atacCellTypeLabels.has(label),
            rnaOrgans: rnaOrgansMap[label] ?? [],
            atacOrgans: atacOrgansMap[label] ?? [],
          };
        })
        // Filter any duplicate labels (keep first)
        .filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    );
  }, [results, allCellTypeNames, rnaOrgansMap, rnaCellTypeLabels, atacCellTypeLabels, atacOrgansMap]);

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
    isLoading: isLoadingCLIDs || isLoadingLanding || isLoadingDescriptions,
    isValidating: isValidatingLanding,
    descriptionsError,
  };
}
