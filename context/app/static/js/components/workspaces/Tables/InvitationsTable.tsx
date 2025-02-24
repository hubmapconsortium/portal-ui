import React, { useEffect, useMemo, useState } from 'react';

import { WorkspaceInvitation } from 'js/components/workspaces/types';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import WorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/WorkspaceItemsTable';
import { Alert } from 'js/shared-styles/alerts/Alert';

const initialSortField: SortField = {
  field: 'datetime_share_created',
  direction: 'desc',
};

const InvitationsTable = React.memo(function InvitationsTable({
  isLoading,
  invitations,
  status,
}: {
  isLoading: boolean;
  invitations: WorkspaceInvitation[];
  status: 'Received' | 'Sent';
}) {
  const { pendingCount, acceptedCount } = useMemo(() => {
    const pending = invitations.filter((inv) => !inv.is_accepted).length;
    return { pendingCount: pending, acceptedCount: invitations.length - pending };
  }, [invitations]);

  const [showPending, setShowPending] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);

  useEffect(() => {
    setShowPending(pendingCount > 0);
  }, [pendingCount]);

  const filteredInvitations = useMemo(
    () =>
      [...invitations].filter((invitation) => {
        if (showPending && !invitation.is_accepted) return true;
        if (showAccepted && invitation.is_accepted) return true;
        return false;
      }),
    [invitations, showPending, showAccepted],
  );

  const tableFields: TableField[] = useMemo(
    () => [
      {
        field: 'original_workspace_id.name',
        label: 'Name',
      },
      {
        field:
          status === 'Received' ? 'original_workspace_id.user_id.username' : 'shared_workspace_id.user_id.username',
        label: status === 'Received' ? 'Shared By' : 'Recipient',
      },
      {
        field: 'datetime_share_created',
        label: 'Shared Date',
      },
    ],
    [status],
  );

  const filters: TableFilter[] = useMemo(
    () => [
      {
        label: `Show Pending (${pendingCount})`,
        setShow: setShowPending,
        show: showPending,
        disabled: !pendingCount,
      },
      {
        label: `Show Accepted (${acceptedCount})`,
        setShow: setShowAccepted,
        show: showAccepted,
        disabled: !acceptedCount,
      },
    ],
    [acceptedCount, pendingCount, showAccepted, showPending],
  );

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
      showSeeMoreOption
    />
  );
});

export default InvitationsTable;
