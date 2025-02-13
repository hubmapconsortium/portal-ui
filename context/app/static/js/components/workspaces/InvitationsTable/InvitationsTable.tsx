import React, { useState } from 'react';
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
import { getInvitationFieldValue } from 'js/components/workspaces/InvitationsTable/utils';
import { EmailIcon } from 'js/shared-styles/icons';

type SortDirection = 'asc' | 'desc';

interface TableField {
  field: string;
  label: string;
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

function SortHeaderCell({ field, label }: { field: string; label: string }) {
  const [sortField, setSortField] = useState<{ direction: SortDirection; field: string }>({
    direction: 'desc',
    field: '',
  });

  const { direction, field: currentSortField } = sortField;
  const isCurrentSortField = field === currentSortField;

  const handleClick = useEventCallback(() => {
    const newSortDirection = getSortOrder({ direction, isCurrentSortField });
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
        <OrderIcon direction={direction} isCurrentSortField={isCurrentSortField} />
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

const HeaderCells = React.memo(function HeaderCells({ tableFields }: { tableFields: TableField[] }) {
  return (
    <>
      {tableFields.map(({ field, label }) => (
        <SortHeaderCell key={field} field={field} label={label} />
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
  const tableFields: TableField[] = [
    {
      field: 'original_workspace_id.name',
      label: 'Name',
    },
    {
      field: status === 'Received' ? 'original_workspace_id.user_id.username' : 'shared_workspace_id.user_id.username',
      label: status === 'Received' ? 'Shared By' : 'Recipient',
    },
    {
      field: 'datetime_share_created',
      label: 'Shared Date',
    },
  ];

  return (
    <Box>
      <StyledTable>
        <TableHead>
          <TableRow>
            <HeaderCells tableFields={tableFields} />
          </TableRow>
        </TableHead>
        <StyledTableBody>
          {isLoading && !invitations?.length && <LoadingRows tableWidth={tableFields.length} />}
          {invitations.map((invitation) => (
            <ResultRow invitation={invitation} key={invitation.datetime_share_created} tableFields={tableFields} />
          ))}
        </StyledTableBody>
      </StyledTable>
    </Box>
  );
});

export default InvitationsTable;
