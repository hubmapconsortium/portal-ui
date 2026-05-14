import { PropsWithChildren } from 'react';
import { AutocompleteResult } from './AutocompleteEntity/types';

export const QUERY_TYPES = ['gene', 'protein', 'cell-type'] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export const GENE_QUERY_METHODS = {
  scFind: 'scFind - RNAseq experiments (gene expression)',
  scFindATAC: 'scFind - ATACseq experiments (DNA accessibility)',
  crossModalityRNA: 'Cells Cross-Modality - RNAseq experiments (gene expression)',
  crossModalityATAC: 'Cells Cross-Modality - ATACseq experiments (DNA accessibility)',
};

export type GeneQueryMethod = keyof typeof GENE_QUERY_METHODS;

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

export interface CrossModalityGeneQueryFormState {
  queryType: 'gene';
  queryMethod: 'crossModalityRNA' | 'crossModalityATAC';
  minimumExpressionLevel: number;
  minimumCellPercentage: number;
  genes: AutocompleteResult[];
}

type GeneQueryFormState = {
  pathway: AutocompleteResult | null;
} & (SCFindGeneQueryFormState | SCFindATACGeneQueryFormState | CrossModalityGeneQueryFormState);

export interface ProteinQueryFormState {
  queryType: 'protein';
  queryMethod: 'crossModality';
  proteins: AutocompleteResult[];
  minimumAbundance: number;
  minimumCellPercentage: number;
}

export interface CellTypeQueryFormState {
  queryType: 'cell-type';
  queryMethod: 'scFind' | 'scFindATAC' | 'crossModality';
  cellTypes: AutocompleteResult[];
}

export type MolecularDataQueryFormState = GeneQueryFormState | ProteinQueryFormState | CellTypeQueryFormState;

export interface MolecularDataQueryFormProps extends PropsWithChildren {
  initialValues?: Partial<MolecularDataQueryFormState>;
}
