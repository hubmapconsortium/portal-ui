import React from 'react';
import { TableField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import SortHeaderCell from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/SortHeaderCell';
import { SortDirection } from 'js/shared-styles/tables/TableOrdering/TableOrdering';

function HeaderCells(props: {
  tableFields: TableField[];
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
  status?: string;
}) {
  const { tableFields, ...rest } = props;
  return (
    <>
      {tableFields.map(({ field, label }) => (
        <SortHeaderCell key={field} field={field} label={label} {...rest} />
      ))}
    </>
  );
}

export default HeaderCells;
