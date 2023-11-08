export type QueryType = 'gene' | 'protein';
export interface QueryTypeObj {
  value: QueryType;
  measurement: string;
}

const queryTypes: Record<QueryType, QueryTypeObj> = {
  gene: { value: 'gene', measurement: 'Expression Level' },
  protein: { value: 'protein', measurement: 'Abundance' },
};

export { queryTypes };
