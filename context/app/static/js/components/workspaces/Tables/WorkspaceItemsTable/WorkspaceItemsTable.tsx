import React from 'react';
import Box from '@mui/material/Box';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { useWorkspaceItemsTable } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import TableContent from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/TableContent';
import { WorkspaceItem, WorkspaceItemsTableProps } from './types';
import { ChipWrapper } from './style';

function WorkspaceItemsTable<T extends WorkspaceItem>(props: WorkspaceItemsTableProps<T>) {
  const { filters, status, itemType } = props;
  const { trackFilterClick } = useWorkspaceItemsTable({ itemType, status });

  return (
    <Box>
      <ChipWrapper>
        {filters.map(({ label, show, setShow, disabled }) => (
          <SelectableChip
            key={label}
            label={label}
            isSelected={show}
            onClick={() => trackFilterClick(label, setShow)}
            disabled={disabled}
          />
        ))}
      </ChipWrapper>
      <TableContent {...props} />
    </Box>
  );
}

export default WorkspaceItemsTable;
