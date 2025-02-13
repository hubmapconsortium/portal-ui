export const QUERY_TYPES = ['gene', 'protein', 'cell-type'] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export const GENE_QUERY_METHODS = {
  scFind: 'scFind - RNAseq experiments (gene expression)',
  crossModalityRNA: 'Cells Cross-Modality - RNAseq experiments (gene expression)',
  crossModalityATAC: 'Cells Cross-Modality - ATACseq experiments (DNA accessibility)',
};

export type GeneQueryMethod = keyof typeof GENE_QUERY_METHODS;

export interface SCFindGeneQueryFormState {
  queryType: 'gene';
  queryMethod: 'scFind';
  genes: string[];
  threshold: number;
}

export interface SCFindCellTypeQueryFormState {
  cellTypes: string[];
}

export interface CrossModalityGeneQueryFormState {
  queryType: 'gene';
  queryMethod: 'crossModalityRNA' | 'crossModalityATAC';
  minimumExpressionLevel: number;
  minimumCellPercentage: number;
  genes: string[];
}

export interface CrossModalityProteinQueryFormState {
  queryType: 'protein';
  proteins: string[];
  minimumAbundance: number;
  minimumCellPercentage: number;
}

export interface CellTypeQueryFormState {
  queryType: 'cell-type';
  cellTypes: string[];
}
