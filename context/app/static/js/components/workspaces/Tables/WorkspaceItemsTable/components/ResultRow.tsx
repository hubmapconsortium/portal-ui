import React from 'react';
import { useResultRow } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { TableField, WorkspaceItem } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import {
  BorderedTableRow,
  CompactTableRow,
  ExpandedTableCell,
  ExpandedTableRow,
  StyledDescriptionContainer,
  StyledTableCell,
} from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';
import ItemCheckbox from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/ItemCheckbox';
import CellContent from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/CellContent';
import EndButtons from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/EndButtons';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function ResultRow<T extends WorkspaceItem>({
  item,
  tableFields,
  selectedItemIds,
  toggleItem,
}: {
  item: T;
  tableFields: TableField[];
  selectedItemIds?: Set<string>;
  toggleItem?: (itemId: string) => void;
}) {
  const { isExpanded, handleDescriptionClick, description, itemId } = useResultRow({ item, tableFields });
  const TableRowComponent: React.ElementType = description ? CompactTableRow : BorderedTableRow;

  return (
    <>
      <TableRowComponent sx={{ '& > *': { borderBottom: 'unset' } }}>
        <ItemCheckbox
          showCheckbox={!!selectedItemIds}
          checked={selectedItemIds?.has(itemId)}
          onChange={() => toggleItem?.(itemId)}
        />
        <StyledTableCell width="0">
          {description && (
            <TooltipIconButton
              tooltip={!isExpanded && 'Show description'}
              aria-label="expand row"
              size="small"
              onClick={handleDescriptionClick}
            >
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </TooltipIconButton>
          )}
        </StyledTableCell>
        {tableFields.map(({ field }) => (
          <StyledTableCell key={field}>
            <CellContent field={field} item={item} />
          </StyledTableCell>
        ))}
        <StyledTableCell>
          <EndButtons item={item} />
        </StyledTableCell>
      </TableRowComponent>
      {description && (
        <ExpandedTableRow>
          {selectedItemIds && toggleItem && <ExpandedTableCell />}
          <ExpandedTableCell />
          <ExpandedTableCell colSpan={tableFields.length + 1}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <StyledDescriptionContainer>{description}</StyledDescriptionContainer>
            </Collapse>
          </ExpandedTableCell>
        </ExpandedTableRow>
      )}
    </>
  );
}

export default ResultRow;
