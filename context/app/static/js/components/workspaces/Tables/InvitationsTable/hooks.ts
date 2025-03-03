import { useEffect, useMemo, useState } from 'react';
import { InvitationType, WorkspaceInvitation } from 'js/components/workspaces/types';
import { TableField, TableFilter } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';

function useInvitationsTable({ invitations, status }: { invitations: WorkspaceInvitation[]; status: InvitationType }) {
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

  const isReceived = status === 'Received';

  const tableFields: TableField[] = useMemo(
    () => [
      {
        field: `${isReceived ? 'shared_workspace_id' : 'original_workspace_id'}.name`,
        label: 'Name',
      },
      {
        field: `${isReceived ? 'original_workspace_id' : 'shared_workspace_id'}.user_id.username`,
        label: isReceived ? 'Shared By' : 'Recipient',
      },
      {
        field: 'datetime_share_created',
        label: 'Shared Date',
      },
    ],
    [isReceived],
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

  return {
    filteredInvitations,
    tableFields,
    filters,
  };
}

export default useInvitationsTable;
