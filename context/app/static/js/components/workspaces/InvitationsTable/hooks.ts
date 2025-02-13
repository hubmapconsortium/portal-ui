import { useEffect, useMemo, useState } from 'react';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
import { get } from 'js/helpers/nodash';

type SortDirection = 'asc' | 'desc';

interface TableField {
  field: string;
  label: string;
}

function getInvitationFieldValue(invitation: WorkspaceInvitation, identifier: string) {
  return get(invitation, identifier, '');
}

function useInvitationsTable({ invitations, status }: { invitations: WorkspaceInvitation[]; status: string }) {
  const [sortField, setSortField] = useState<{ direction: SortDirection; field: string }>({
    direction: 'desc',
    field: 'datetime_share_created',
  });

  const { pendingCount, acceptedCount } = useMemo(() => {
    const pending = invitations.filter((inv) => !inv.is_accepted).length;
    return { pendingCount: pending, acceptedCount: invitations.length - pending };
  }, [invitations]);

  const [showPending, setShowPending] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);

  useEffect(() => {
    setShowPending(pendingCount > 0);
  }, [pendingCount]);

  const sortedInvitations = useMemo(
    () =>
      [...invitations]
        .filter((invitation) => {
          if (showPending && !invitation.is_accepted) return true;
          if (showAccepted && invitation.is_accepted) return true;
          return false;
        })
        .sort((a, b) => {
          const aValue = getInvitationFieldValue(a, sortField.field);
          const bValue = getInvitationFieldValue(b, sortField.field);

          if (aValue < bValue) return sortField.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortField.direction === 'asc' ? 1 : -1;
          return 0;
        }),
    [invitations, sortField, showPending, showAccepted],
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

  return {
    tableFields,
    showPending,
    setShowPending,
    showAccepted,
    setShowAccepted,
    sortField,
    setSortField,
    pendingCount,
    acceptedCount,
    sortedInvitations,
  };
}

export { useInvitationsTable, getInvitationFieldValue, type TableField, type SortDirection };
