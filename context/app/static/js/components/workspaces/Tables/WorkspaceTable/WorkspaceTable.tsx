import React, { useMemo, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/system/Stack';
import { format } from 'date-fns/format';

import { get } from 'js/helpers/nodash';
import { Alert } from 'js/shared-styles/alerts/Alert';
import { InternalLink } from 'js/shared-styles/Links';
import { WorkspaceWithUserId, WorkspaceInvitation } from 'js/components/workspaces/types';

import { Button, Collapse, Typography, useEventCallback } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DownIcon, EmailIcon } from 'js/shared-styles/icons';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { LineClamp } from 'js/shared-styles/text';
import { SortField, SortDirection, TableField, TableFilter } from './types';
import {
  ArrowDownOff,
  ArrowDownOn,
  ArrowUpOn,
  ChipWrapper,
  CompactTableRow,
  ExpandedTableCell,
  ExpandedTableRow,
  StyledHeaderCell,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledButton,
  StyledTableContainer,
  StyledTableRow,
  StyledTableHead,
} from './style';

export function getFieldValue(item: WorkspaceInvitation | WorkspaceWithUserId, field: string) {
  return get(item, field, '');
}

export function OrderIcon({
  direction,
  isCurrentSortField,
}: {
  direction: SortDirection;
  isCurrentSortField: boolean;
}) {
  if (!isCurrentSortField) return <ArrowDownOff />;
  if (direction === 'asc') return <ArrowUpOn />;
  if (direction === 'desc') return <ArrowDownOn />;
}

export function getSortOrder({
  direction,
  isCurrentSortField,
}: {
  direction: SortDirection;
  isCurrentSortField: boolean;
}) {
  if (!isCurrentSortField) {
    return 'desc';
  }

  return direction === 'desc' ? 'asc' : 'desc';
}

function SortHeaderCell({
  field,
  label,
  sortField,
  setSortField,
}: {
  field: string;
  label: string;
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
}) {
  const isCurrentSortField = field === sortField.field;

  const handleClick = useEventCallback(() => {
    const newSortDirection = getSortOrder({ direction: sortField.direction, isCurrentSortField });
    setSortField({ direction: newSortDirection, field });
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

function CellContent({ item, field }: { field: string; item: WorkspaceInvitation | WorkspaceWithUserId }) {
  const fieldValue = getFieldValue(item, field);

  // Get appropriate prefix if this is an invitation
  const regex = /^(original_workspace_id|shared_workspace_id)/;
  const match = regex.exec(field);
  const prefix = match ? `${match[0]}.` : '';

  switch (field) {
    case `${prefix}name`: {
      const workspaceId = getFieldValue(item, `${prefix}id`);
      return (
        <Stack direction="row" spacing={1}>
          <InternalLink href={`/workspaces/${workspaceId}`}>
            <LineClamp lines={1}>{fieldValue}</LineClamp>
          </InternalLink>
          <Box>{`(ID: ${workspaceId})`}</Box>
        </Stack>
      );
    }
    case `${prefix}user_id.username`: {
      if ('user_id' in item && !item.user_id) {
        return <Typography>Me</Typography>;
      }

      const firstName = getFieldValue(item, `${prefix}user_id.first_name`);
      const lastName = getFieldValue(item, `${prefix}user_id.last_name`);
      const email = getFieldValue(item, `${prefix}user_id.email`);

      return (
        <Stack direction="row" alignItems="center">
          <Typography>{`${firstName} ${lastName}`}</Typography>
          <Button href={`mailto:${email}`} sx={{ minWidth: 0 }}>
            <EmailIcon color="info" />
          </Button>
        </Stack>
      );
    }
    case 'datetime_created':
    case 'datetime_share_created':
      return format(fieldValue, 'yyyy-MM-dd');
    default:
      return <Typography>{fieldValue}</Typography>;
  }
}

function LoadingRows({ tableWidth }: { tableWidth: number }) {
  return Array.from({ length: 3 }).map((_, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <TableRow key={i}>
      {Array.from({ length: tableWidth }).map(() => (
        // eslint-disable-next-line react/no-array-index-key
        <StyledTableCell key={i}>
          <Skeleton variant="text" />
        </StyledTableCell>
      ))}
    </TableRow>
  ));
}

interface RowProps<T extends WorkspaceInvitation | WorkspaceWithUserId> {
  item: T;
  tableFields: TableField[];
  endButtons: (item: WorkspaceInvitation | WorkspaceWithUserId) => React.ReactNode;
  selectedItemIds?: Set<string>;
  toggleItem?: (itemId: string) => void;
}

const ResultRow = React.memo(function ResultRow<T extends WorkspaceInvitation | WorkspaceWithUserId>({
  item,
  tableFields,
  endButtons,
  selectedItemIds,
  toggleItem,
}: RowProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const description = getFieldValue(item, 'description');

  const itemId = 'id' in item ? item.id.toString() : item.original_workspace_id.id.toString();

  return (
    <>
      <CompactTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {selectedItemIds && toggleItem && (
          <StyledTableCell width="0">
            <Checkbox checked={selectedItemIds.has(itemId)} onChange={() => toggleItem(itemId)} />
          </StyledTableCell>
        )}
        <StyledTableCell width="0">
          {description && (
            <IconButton aria-label="expand row" size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
        </StyledTableCell>
        {tableFields.map(({ field }) => (
          <StyledTableCell key={field}>
            <CellContent field={field} item={item} />
          </StyledTableCell>
        ))}
        <StyledTableCell>{endButtons ? endButtons(item) : undefined}</StyledTableCell>
      </CompactTableRow>
      {description && (
        <ExpandedTableRow>
          <ExpandedTableCell />
          <ExpandedTableCell colSpan={tableFields.length + 1}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box paddingTop={0.5} paddingBottom={1}>
                {description}
              </Box>
            </Collapse>
          </ExpandedTableCell>
        </ExpandedTableRow>
      )}
    </>
  );
});

const HeaderCells = React.memo(function HeaderCells({
  tableFields,
  sortField,
  setSortField,
}: {
  tableFields: TableField[];
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
}) {
  return (
    <>
      {tableFields.map(({ field, label }) => (
        <SortHeaderCell key={field} field={field} label={label} sortField={sortField} setSortField={setSortField} />
      ))}
    </>
  );
});

function SeeMoreRows({
  showSeeMoreOption,
  numVisibleItems,
  setNumVisibleItems,
  totalItems,
}: {
  showSeeMoreOption?: boolean;
  numVisibleItems: number;
  setNumVisibleItems: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}) {
  if (!showSeeMoreOption || numVisibleItems >= totalItems) {
    return null;
  }

  return (
    <StyledButton variant="text" onClick={() => setNumVisibleItems((prev) => prev + 3)} fullWidth>
      <Stack direction="row" spacing={1} marginY={0.5} alignItems="center">
        <Typography variant="button">See More</Typography>
        <DownIcon />
      </Stack>
    </StyledButton>
  );
}

const WorkspaceTable = React.memo(function WorkspaceTable<T extends WorkspaceInvitation | WorkspaceWithUserId>({
  items,
  isLoading,
  itemType,
  filters,
  tableFields,
  initialSortField,
  endButtons,
  toggleItem,
  selectedItemIds,
  showSeeMoreOption,
}: {
  items: T[];
  isLoading: boolean;
  itemType: string;
  filters: TableFilter[];
  tableFields: TableField[];
  initialSortField: SortField;
  endButtons: (item: WorkspaceInvitation | WorkspaceWithUserId) => React.ReactNode;
  toggleItem?: (itemId: string) => void;
  selectedItemIds?: Set<string>;
  showSeeMoreOption?: boolean;
}) {
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [numVisibleItems, setNumVisibleItems] = useState(showSeeMoreOption ? 3 : items.length);

  const noFiltersSelected = filters.every(({ show }) => !show);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aValue = getFieldValue(a, sortField.field);
        const bValue = getFieldValue(b, sortField.field);

        if (aValue < bValue) return sortField.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortField.direction === 'asc' ? 1 : -1;
        return 0;
      }),
    [items, sortField],
  );

  const onToggleCheckboxHeader = useEventCallback(() => {
    if (!selectedItemIds || !toggleItem) {
      return;
    }

    items.forEach((item) => {
      const itemId = 'id' in item ? item.id.toString() : item.original_workspace_id.id.toString();
      if (selectedItemIds.size === items.length) {
        toggleItem(itemId);
      } else if (!selectedItemIds.has(itemId)) {
        toggleItem(itemId);
      }
    });
  });

  return (
    <Box>
      <ChipWrapper>
        {filters.map(({ label, show, setShow, disabled }) => (
          <SelectableChip
            key={label}
            label={label}
            isSelected={show}
            onClick={() => setShow((prev) => !prev)}
            disabled={disabled}
          />
        ))}
      </ChipWrapper>
      {!isLoading && noFiltersSelected ? (
        <Alert severity="info">{`No ${itemType}s to display based on current filters.`}</Alert>
      ) : (
        <>
          <StyledTableContainer>
            <StyledTable>
              <StyledTableHead>
                <StyledTableRow>
                  {selectedItemIds && toggleItem && (
                    <StyledTableCell width="0">
                      <Checkbox checked={selectedItemIds.size === items.length} onChange={onToggleCheckboxHeader} />
                    </StyledTableCell>
                  )}
                  <StyledTableCell width="0" />
                  <HeaderCells tableFields={tableFields} sortField={sortField} setSortField={setSortField} />
                  <StyledTableCell />
                </StyledTableRow>
              </StyledTableHead>
              <StyledTableBody>
                {isLoading && <LoadingRows tableWidth={tableFields.length} />}
                {sortedItems.slice(0, numVisibleItems).map((item) => (
                  <ResultRow
                    key={'id' in item ? item.id : item.original_workspace_id.id}
                    item={item}
                    tableFields={tableFields}
                    endButtons={endButtons}
                    selectedItemIds={selectedItemIds}
                    toggleItem={toggleItem}
                  />
                ))}
              </StyledTableBody>
            </StyledTable>
          </StyledTableContainer>
          <SeeMoreRows
            showSeeMoreOption={showSeeMoreOption}
            numVisibleItems={numVisibleItems}
            setNumVisibleItems={setNumVisibleItems}
            totalItems={items.length}
          />
        </>
      )}
    </Box>
  );
});

export default WorkspaceTable;
