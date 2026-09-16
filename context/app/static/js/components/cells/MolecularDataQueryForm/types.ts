import { PropsWithChildren } from 'react';
import { AutocompleteResult } from './AutocompleteEntity/types';

export type QueryType = 'gene' | 'cell-type';

export type QueryMethod = 'scFind' | 'scFindATAC';

// Note: SCFind reads "undefined" modality as RNA
export type SCFindModality = 'ATAC' | undefined;

export interface MolecularDataQueryFormState {
  queryType: QueryType;
  queryMethod: QueryMethod;
  genes: AutocompleteResult[];
  cellTypes: AutocompleteResult[];
  pathway: AutocompleteResult | null;
}

export interface MolecularDataQueryFormProps extends PropsWithChildren {
  initialValues?: Partial<MolecularDataQueryFormState>;
}
