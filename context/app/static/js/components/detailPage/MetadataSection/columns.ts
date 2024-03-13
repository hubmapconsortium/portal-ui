interface Column {
  id: string;
  label: string;
}

export type Columns = Column[];

export const defaultColumns = [
  { id: 'key', label: 'Key' },
  { id: 'value', label: 'Value' },
];

export const defaultTSVColumns = [...defaultColumns, { id: 'description', label: 'Description' }];
