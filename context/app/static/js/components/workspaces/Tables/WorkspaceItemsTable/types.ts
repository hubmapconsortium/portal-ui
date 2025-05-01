import { InvitationType, WorkspaceInvitation, WorkspaceWithCreatorInfo } from 'js/components/workspaces/types';
import { SortDirection } from 'js/shared-styles/tables/TableOrdering/TableOrdering';

export type WorkspaceItem = WorkspaceInvitation | WorkspaceWithCreatorInfo;

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

export interface WorkspaceItemsTableProps<T extends WorkspaceItem> {
  items: T[];
  itemType: string;
  filters: TableFilter[];
  tableFields: TableField[];
  initialSortField: SortField;
  status?: InvitationType;
  toggleItem?: (itemId: string) => void;
  toggleAllItems?: (itemIds: string[]) => void;
  selectedItemIds?: Set<string>;
  showSeeMoreOption?: boolean;
  isLoading?: boolean;
}
