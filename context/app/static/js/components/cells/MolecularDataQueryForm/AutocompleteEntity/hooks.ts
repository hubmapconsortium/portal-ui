import useSWR from 'swr';
import { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useMemo } from 'react';
import CellsService from '../../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse } from './types';

const cellsService = new CellsService();

interface AutocompleteQueryKeyExtended extends AutocompleteQueryKey {
  scFindCellTypeNames: Record<string, string[]>;
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
    const cellTypeNames = Object.keys(scFindCellTypeNames);
    const cellTypeNameMatches = cellTypeNames.filter((cellTypeName) =>
      cellTypeName.toLowerCase().includes(substring.toLowerCase()),
    );

    return cellTypeNameMatches.map((cellTypeName) => {
      const tags = scFindCellTypeNames[cellTypeName];

      const matchIndex = cellTypeName.toLowerCase().indexOf(substring.toLowerCase());
      const pre = cellTypeName.slice(0, matchIndex);
      const match = cellTypeName.slice(matchIndex, matchIndex + substring.length);
      const post = cellTypeName.slice(matchIndex + substring.length);

      return {
        full: cellTypeName,
        pre,
        match,
        post,
        tags,
        values: tags.map((tag) => `${tag}.${cellTypeName}`),
      };
    });
  }

  return cellsService.searchBySubstring({ targetEntity, substring });
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  const scFindCellTypeNames = useCellTypeNamesMap();

  const key = useMemo(() => ({ ...queryKey, scFindCellTypeNames }), [queryKey, scFindCellTypeNames]);

  return useSWR(key, fetchEntityAutocomplete);
}
