import React from 'react';

import { InvitationType, WorkspaceInvitation } from 'js/components/workspaces/types';
import { SortField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import WorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/WorkspaceItemsTable';
import useInvitationsTable from 'js/components/workspaces/Tables/InvitationsTable/hooks';
import { StyledTable, StyledTableContainer } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';
import { CenteredAlert } from 'js/components/style';

const initialSortField: SortField = {
  field: 'datetime_share_created',
  direction: 'desc',
};

interface InvitationsTableProps {
  invitations: WorkspaceInvitation[];
  status: InvitationType;
  isLoading?: boolean;
}
const InvitationsTable = React.memo(function InvitationsTable({
  invitations,
  status,
  isLoading,
}: InvitationsTableProps) {
  const { filteredInvitations, filters, tableFields } = useInvitationsTable({ invitations, status });

  if (!isLoading && !invitations.length) {
    return (
      <StyledTableContainer sx={(theme) => ({ padding: theme.spacing(2) })}>
        <StyledTable>
          <CenteredAlert severity="info">No {status.toLocaleLowerCase()} workspace invitations.</CenteredAlert>
        </StyledTable>
      </StyledTableContainer>
    );
  }

  return (
    <WorkspaceItemsTable
      items={filteredInvitations}
      isLoading={isLoading}
      itemType="invitation"
      filters={filters}
      tableFields={tableFields}
      initialSortField={initialSortField}
      status={status}
      showSeeMoreOption
    />
  );
});

export default InvitationsTable;
