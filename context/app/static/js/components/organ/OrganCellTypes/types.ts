export interface CellTypesTableProps {
  cellTypes: string[];
}

export interface CellTypeRowProps {
  cellType: string;
  clid?: string;
  matchedDatasets?: string[];
  percentage?: string;
  totalIndexedDatasets?: number;
}

export type CellTypeProps = Pick<CellTypeRowProps, 'cellType'>;

export type CLIDCellProps = Pick<CellTypeRowProps, 'clid'>;
