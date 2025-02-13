import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/system/Stack';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
import {
  StyledTable,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
  ArrowUpOn,
  ArrowDownOn,
  ArrowDownOff,
  StyledHeaderCell,
} from 'js/components/search/Results/style';
import { Button, Typography, useEventCallback } from '@mui/material';
import { EmailIcon } from 'js/shared-styles/icons';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { ChipWrapper } from './style';
import { SortDirection, TableField, useInvitationsTable, getInvitationFieldValue } from './hooks';

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

function CellContent({ invitation, field }: { field: string; invitation: WorkspaceInvitation }) {
  const fieldValue = getInvitationFieldValue(invitation, field);

  switch (field) {
    case 'original_workspace_id.name': {
      const workspaceId = getInvitationFieldValue(invitation, 'original_workspace_id.id');
      return (
        <>
          {/* TODO: Add link to workspace preview */}
          <InternalLink href="/workspaces">{fieldValue}</InternalLink>
          {` (ID: ${workspaceId})`}
        </>
      );
    }
    case 'original_workspace_id.user_id.username':
    case 'shared_workspace_id.user_id.username': {
      const prefix = field.startsWith('original_workspace_id') ? 'original_workspace_id' : 'shared_workspace_id';
      const firstName = getInvitationFieldValue(invitation, `${prefix}.user_id.first_name`);
      const lastName = getInvitationFieldValue(invitation, `${prefix}.user_id.last_name`);
      const email = getInvitationFieldValue(invitation, `${prefix}.user_id.email`);

      return (
        <Stack direction="row" alignItems="center">
          <Typography>{`${firstName} ${lastName} (${email})`}</Typography>
          <Button href={`mailto:${email}`} sx={{ minWidth: 0 }}>
            <EmailIcon color="info" />
          </Button>
        </Stack>
      );
    }
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

interface RowProps {
  invitation: WorkspaceInvitation;
  tableFields: TableField[];
}

const ResultRow = React.memo(function ResultRow({ invitation, tableFields }: RowProps) {
  return (
    <StyledTableRow>
      {tableFields.map(({ field }) => (
        <StyledTableCell key={field}>
          <CellContent field={field} invitation={invitation} />
        </StyledTableCell>
      ))}
    </StyledTableRow>
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

const InvitationsTable = React.memo(function InvitationsTable({
  isLoading,
  invitations,
  status,
}: {
  isLoading: boolean;
  invitations: WorkspaceInvitation[];
  status: 'Received' | 'Sent';
}) {
  const {
    tableFields,
    sortField,
    setSortField,
    showAccepted,
    showPending,
    setShowAccepted,
    setShowPending,
    hasAcceptedInvitations,
    hasPendingInvitations,
    sortedInvitations,
  } = useInvitationsTable({ invitations, status });

  return (
    <Box>
      <StyledTable>
        <TableHead sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.grey[300]}` })}>
          <ChipWrapper>
            <SelectableChip
              label="Show Pending"
              isSelected={showPending}
              onClick={() => setShowPending((prev) => !prev)}
              disabled={!hasPendingInvitations}
            />
            <SelectableChip
              label="Show Accepted"
              isSelected={showAccepted}
              onClick={() => setShowAccepted((prev) => !prev)}
              disabled={!hasAcceptedInvitations}
            />
          </ChipWrapper>
        </TableHead>
        <TableHead>
          <TableRow>
            <HeaderCells tableFields={tableFields} sortField={sortField} setSortField={setSortField} />
          </TableRow>
        </TableHead>
        <StyledTableBody>
          {isLoading && !invitations?.length && <LoadingRows tableWidth={tableFields.length} />}
          {sortedInvitations.map((invitation) => (
            <ResultRow invitation={invitation} key={invitation.datetime_share_created} tableFields={tableFields} />
          ))}
        </StyledTableBody>
      </StyledTable>
    </Box>
  );
});

export default InvitationsTable;
