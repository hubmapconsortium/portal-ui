import { QueryType } from '../../queryTypes';
import { CellTypeQueryFormState, CrossModalityGeneQueryFormState } from '../types';

export interface AutocompleteQueryKey {
  targetEntity: QueryType;
  substring: string;
  queryMethod: CellTypeQueryFormState['queryMethod'] | CrossModalityGeneQueryFormState['queryMethod'];
}

export interface AutocompleteResult {
  match: string;
  full: string;
  pre: string;
  post: string;
  tags?: string[];
  values?: string[];
  organs?: string[]; // For cell types: list of organs where this cell type appears
}

export type AutocompleteQueryResponse = AutocompleteResult[];
