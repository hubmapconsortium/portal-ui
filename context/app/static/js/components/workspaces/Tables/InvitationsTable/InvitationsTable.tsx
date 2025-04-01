import React from 'react';

import { InvitationType, WorkspaceInvitation } from 'js/components/workspaces/types';
import { SortField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import WorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/WorkspaceItemsTable';
import { Alert } from 'js/shared-styles/alerts/Alert';
import useInvitationsTable from 'js/components/workspaces/Tables/InvitationsTable/hooks';

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
    return <Alert severity="info"> {`No ${status.toLocaleLowerCase()} workspace invitations.`} </Alert>;
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
