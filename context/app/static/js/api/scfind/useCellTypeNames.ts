import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { scaleOrdinal } from '@visx/scale';
import { useTheme } from '@mui/material/styles';
import { createScFindFlaskKey, formatCellTypeName } from './utils';

type CellTypeNamesKey = string;

interface CellTypeNamesResponse {
  cellTypeNames: string[];
}

// The Flask BFF route returns the list under `cell_types`; we remap to `cellTypeNames` so the
// shape consumed by useCellTypeNamesMap/useCellTypeOrgans and other callers is unchanged.
interface CellTypeNamesFlaskResponse {
  cell_types: string[];
}

export function createCellTypeNamesKey(modality?: string): CellTypeNamesKey {
  return createScFindFlaskKey('/scfind/cell-type-names.json', { modality });
}

export default function useCellTypeNames(modality?: string) {
  const key = createCellTypeNamesKey(modality);
  const { data, ...rest } = useSWR<CellTypeNamesFlaskResponse, unknown, CellTypeNamesKey>(key, (url) =>
    fetcher({ url }),
  );

  const filteredData: CellTypeNamesResponse | undefined = useMemo(() => {
    if (!data) {
      return undefined;
    }
    // Filter out `other`
    const filteredCellTypeNames = data.cell_types.filter((name) => formatCellTypeName(name) !== 'other');
    return { cellTypeNames: filteredCellTypeNames };
  }, [data]);

  return { data: filteredData, ...rest };
}

// Returns a map of cell type names to the organs that contain them
export function useCellTypeNamesMap() {
  const { data } = useCellTypeNames();
  return useMemo(() => {
    if (!data) {
      return {};
    }
    return data.cellTypeNames.reduce((acc: Record<string, string[]>, organAndCellTypeName) => {
      const [organ, cellTypeName] = organAndCellTypeName.split('.');
      if (!acc[cellTypeName]) {
        acc[cellTypeName] = [];
      }
      acc[cellTypeName].push(organ);
      return acc;
    }, {});
  }, [data]);
}

// Returns a list of organs that are indexed in scFind
export function useCellTypeOrgans() {
  const { data } = useCellTypeNames();
  return useMemo(() => {
    if (!data) {
      return [];
    }
    const organs = new Set<string>();
    data.cellTypeNames.forEach((organAndCellTypeName) => {
      const [organ] = organAndCellTypeName.split('.');
      organs.add(organ);
    });
    return Array.from(organs);
  }, [data]);
}

// Returns a map of organs to the colors that are used to represent them in the UI
export function useCellTypeOrgansColorMap() {
  const organs = useCellTypeOrgans();
  const theme = useTheme();
  return scaleOrdinal({
    domain: organs,
    range: [
      theme.palette.accent.success90,
      theme.palette.accent.primary90,
      theme.palette.accent.info90,
      theme.palette.accent.warning90,
    ],
  });
}
