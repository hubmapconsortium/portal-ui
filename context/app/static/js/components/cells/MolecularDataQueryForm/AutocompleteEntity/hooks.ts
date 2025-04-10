import useSWR from 'swr';
import useCellTypeNames from 'js/api/scfind/useCellTypeNames';
import { useMemo } from 'react';
import CellsService from '../../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse } from './types';

const cellsService = new CellsService();

interface AutocompleteQueryKeyExtended extends AutocompleteQueryKey {
  scFindCellTypeNames: string[];
}

const fetchEntityAutocomplete = async ({
  targetEntity,
  substring,
  queryMethod,
  scFindCellTypeNames,
}: AutocompleteQueryKeyExtended): Promise<AutocompleteQueryResponse> => {
  if (!substring) {
    return [];
  }

  // scfind does not provide a matching query, so we can do this locally
  // TODO: move this logic up to the flask server (routes_cells)
  if (queryMethod === 'scFind') {
    return scFindCellTypeNames.reduce((acc, organAndCellTypeName) => {
      const [organ, cellTypeName] = organAndCellTypeName.split('.');
      const fullNameLower = organAndCellTypeName.toLowerCase();
      const cellTypeNameLower = cellTypeName.toLowerCase();
      const substringLower = substring.toLowerCase();

      if (fullNameLower.includes(substringLower)) {
        const matchIndex = cellTypeNameLower.indexOf(substringLower);
        const endIndex = matchIndex + substringLower.length;
        acc.push({
          full: organAndCellTypeName,
          pre: cellTypeName.slice(0, matchIndex),
          match: cellTypeName.slice(matchIndex, endIndex),
          post: cellTypeName.slice(endIndex),
          tag: organ,
        });
      }
      return acc;
    }, [] as AutocompleteQueryResponse);
  }

  return cellsService.searchBySubstring({ targetEntity, substring });
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  const { data = { cellTypeNames: [] } } = useCellTypeNames();

  const key = useMemo(() => ({ ...queryKey, scFindCellTypeNames: data.cellTypeNames }), [queryKey, data]);

  return useSWR(key, fetchEntityAutocomplete);
}
