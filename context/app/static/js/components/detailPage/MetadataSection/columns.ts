interface Column {
  id: string;
  label: string;
}

export type Columns = Column[];

export const defaultColumns = [
  { id: 'key', label: 'Key' },
  { id: 'value', label: 'Value' },
];

export const defaultTSVColumns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'label', label: 'Entity' },
  ...defaultColumns,
  { id: 'description', label: 'Description' },
];
