import { PropsWithChildren } from 'react';
import { AutocompleteResult } from './AutocompleteEntity/types';

export type QueryType = 'gene' | 'cell-type';

// Note: SCFind reads "undefined" modality as RNA
export type SCFindModality = 'ATAC' | undefined;

export interface SCFindGeneQueryFormState {
  queryType: 'gene';
  queryMethod: 'scFind';
  genes: AutocompleteResult[];
  threshold: number;
}

export interface SCFindATACGeneQueryFormState {
  queryType: 'gene';
  queryMethod: 'scFindATAC';
  genes: AutocompleteResult[];
  threshold: number;
}

type GeneQueryFormState = {
  pathway: AutocompleteResult | null;
} & (SCFindGeneQueryFormState | SCFindATACGeneQueryFormState);

export interface CellTypeQueryFormState {
  queryType: 'cell-type';
  queryMethod: 'scFind' | 'scFindATAC';
  cellTypes: AutocompleteResult[];
}

export type MolecularDataQueryFormState = GeneQueryFormState | CellTypeQueryFormState;

export interface MolecularDataQueryFormProps extends PropsWithChildren {
  initialValues?: Partial<MolecularDataQueryFormState>;
}
