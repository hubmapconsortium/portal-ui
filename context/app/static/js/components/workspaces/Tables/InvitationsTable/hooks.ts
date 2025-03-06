import { useEffect, useMemo, useState } from 'react';
import { InvitationType, WorkspaceInvitation } from 'js/components/workspaces/types';
import { TableField, TableFilter } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';

function useInvitationsTable({ invitations, status }: { invitations: WorkspaceInvitation[]; status: InvitationType }) {
  const { pendingInvites, acceptedInvites } = useMemo(() => {
    const pending = invitations.filter((invite) => {
      return !invite.is_accepted;
    });
    const accepted = invitations.filter((invite) => {
      return !!invite.is_accepted;
    });
    return { pendingInvites: pending, acceptedInvites: accepted };
  }, [invitations]);

  const [showPending, setShowPending] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);

  useEffect(() => {
    setShowPending(pendingInvites.length > 0);
  }, [pendingInvites.length]);

  const filteredInvitations = useMemo(() => {
    if (showPending && showAccepted) {
      return invitations;
    }
    if (showPending) {
      return pendingInvites;
    }
    if (showAccepted) {
      return acceptedInvites;
    }
    return [];
  }, [showPending, showAccepted, pendingInvites, acceptedInvites, invitations]);

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
        label: `Show Pending (${pendingInvites.length})`,
        setShow: setShowPending,
        show: showPending,
        disabled: !pendingInvites.length,
      },
      {
        label: `Show Accepted (${acceptedInvites.length})`,
        setShow: setShowAccepted,
        show: showAccepted,
        disabled: !acceptedInvites.length,
      },
    ],
    [acceptedInvites.length, pendingInvites.length, showAccepted, showPending],
  );

  return {
    filteredInvitations,
    tableFields,
    filters,
  };
}

export default useInvitationsTable;
