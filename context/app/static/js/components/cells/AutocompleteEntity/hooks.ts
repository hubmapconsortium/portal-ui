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
  // TODO: Convert cellsService to TS
  return cellsService.searchBySubstring({ targetEntity, substring }) as Promise<AutocompleteQueryResponse>;
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  return useSWR<AutocompleteQueryResponse, Error>(queryKey, cellsServiceFetcher);
}
