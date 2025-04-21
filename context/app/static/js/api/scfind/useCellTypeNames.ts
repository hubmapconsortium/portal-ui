import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { useMemo } from 'react';
import { scaleOrdinal } from '@visx/scale';
import { createScFindKey } from './utils';

type CellTypeNamesKey = string;

interface CellTypeNamesResponse {
  cellTypeNames: string[];
}

export function createCellTypeNamesKey(scFindEndpoint: string): CellTypeNamesKey {
  return createScFindKey(scFindEndpoint, 'cellTypeNames', {});
}

export default function useCellTypeNames() {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeNamesKey(scFindEndpoint);
  return useSWR<CellTypeNamesResponse, unknown, CellTypeNamesKey>(key, (url) => fetcher({ url }));
}

// Returns a map of cell type names to the organs that contain them
export function useCellTypeNamesMap() {
  const { data } = useCellTypeNames();
  return useMemo(() => {
    if (!data) {
      return {};
    }
    return data.cellTypeNames.reduce(
      (acc, organAndCellTypeName) => {
        const [organ, cellTypeName] = organAndCellTypeName.split('.');
        if (!acc[cellTypeName]) {
          acc[cellTypeName] = [];
        }
        acc[cellTypeName].push(organ);
        return acc;
      },
      {} as Record<string, string[]>,
    );
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
const ORGAN_COLORS = [
  '#F0F3EB', // success-90 in figma
  '#FBEBF3', // primary-90 in figma
  '#EAF0F8', // info-90 in figma
  '#FBEEEB', // warning-90 in figma
];
export function useCellTypeOrgansColorMap() {
  const organs = useCellTypeOrgans();
  return scaleOrdinal({
    domain: organs,
    range: ORGAN_COLORS,
  });
}
