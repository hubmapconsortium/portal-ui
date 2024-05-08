export type QueryType = 'gene' | 'protein' | 'cell-type';
export interface QueryTypeObj {
  value: QueryType;
  measurement: string;
  label: string;
}

const queryTypes: Record<QueryType, QueryTypeObj> = {
  gene: { value: 'gene', measurement: 'Expression Level', label: 'Gene' },
  protein: { value: 'protein', measurement: 'Abundance', label: 'Protein' },
  'cell-type': { value: 'cell-type', measurement: 'Cell Count', label: 'Cell Type' },
};

const isQueryType = (value: string): value is QueryType => {
  return Object.keys(queryTypes).includes(value);
};

export { queryTypes, isQueryType };
