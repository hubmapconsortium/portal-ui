export interface CellTypesTableProps {
  cellTypes: string[];
}

export interface CellTypeRowProps {
  cellType: string;
  clid?: string | null;
  matchedDatasets?: string[];
  percentage?: string;
  totalIndexedDatasets?: number;
  description?: string;
}

export type CellTypeProps = Pick<CellTypeRowProps, 'cellType'>;

export type CLIDCellProps = Pick<CellTypeRowProps, 'clid' | 'cellType'>;
