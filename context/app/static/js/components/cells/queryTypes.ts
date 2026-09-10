export type QueryType = 'gene' | 'cell-type';
export interface QueryTypeObj {
  value: QueryType;
  label: string;
  entityFieldName: 'genes' | 'cellTypes';
}

const queryTypes: Record<QueryType, QueryTypeObj> = {
  gene: {
    value: 'gene',
    label: 'Gene',
    entityFieldName: 'genes',
  },
  'cell-type': {
    value: 'cell-type',
    label: 'Cell Type',
    entityFieldName: 'cellTypes',
  },
};

export { queryTypes };
