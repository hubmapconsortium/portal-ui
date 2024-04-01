import useSWR from 'swr';
import CellsService from '../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse } from './types';

const cellsService = new CellsService();

const cellsServiceFetcher = async ({
  targetEntity,
  substring,
}: AutocompleteQueryKey): Promise<AutocompleteQueryResponse> => {
  if (!substring) {
    return [];
  }
  // TODO: Convert `CellsService` helper to TypeScript so we don't need to cast the response type
  return cellsService.searchBySubstring({ targetEntity, substring }) as Promise<AutocompleteQueryResponse>;
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  return useSWR(queryKey, cellsServiceFetcher);
}
