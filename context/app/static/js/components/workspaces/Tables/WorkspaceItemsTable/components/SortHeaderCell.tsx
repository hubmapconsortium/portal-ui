import React from 'react';
import IconButton from '@mui/material/IconButton';
import { StyledHeaderCell } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';
import { useSortHeaderCell } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { OrderIcon, SortDirection } from 'js/shared-styles/tables/TableOrdering/TableOrdering';

function SortHeaderCell({
  field,
  label,
  sortField,
  setSortField,
  status,
}: {
  field: string;
  label: string;
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
  status?: string;
}) {
  const { isCurrentSortField, handleClick } = useSortHeaderCell({
    field,
    label,
    sortField,
    setSortField,
    status,
  });

  return (
    <StyledHeaderCell>
      {label}
      <IconButton
        aria-label="Sort Column"
        onClick={handleClick}
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      >
        <OrderIcon direction={sortField.direction} isCurrentSortField={isCurrentSortField} />
      </IconButton>
    </StyledHeaderCell>
  );
}

export default SortHeaderCell;
