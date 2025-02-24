export type SortDirection = 'asc' | 'desc';

export interface SortField {
  field: string;
  direction: SortDirection;
}

export interface TableField {
  field: string;
  label: string;
}

export interface TableFilter {
  label: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}
