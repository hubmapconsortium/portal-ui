import React, { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/system/Stack';

import { WorkspaceInvitation, WorkspaceWithUserId } from 'js/components/workspaces/types';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceTable/types';
import WorkspaceTable from 'js/components/workspaces/Tables/WorkspaceTable/WorkspaceTable';
import { Alert } from 'js/shared-styles/alerts/Alert';
import { CheckIcon, CloseFilledIcon, EyeIcon, MoreIcon } from 'js/shared-styles/icons';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { RotatedTooltipButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const acceptInviteTooltip =
  'Accept workspace copy invitation. This will create a copy of this workspace to your profile.';
const previewInviteTooltip = 'Preview the details of this workspace such as the attached datasets and templates.';
const moreOptionsTooltip = 'View additional actions including declining this workspace copy invitation.';

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

  const initialSortField: SortField = {
    field: 'datetime_share_created',
    direction: 'desc',
  };

  const options = [
    {
      children: 'Decline Invitation',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick: () => {},
      icon: CloseFilledIcon,
    },
  ];

  const endButtons = (item: WorkspaceInvitation | WorkspaceWithUserId) => {
    if ('id' in item) {
      return null;
    }

    return (
      <Stack direction="row" justifyContent="end" alignItems="center">
        <IconDropdownMenu tooltip={moreOptionsTooltip} icon={MoreIcon} button={RotatedTooltipButton}>
          {options.map((props) => (
            <IconDropdownMenuItem key={props.children} {...props} />
          ))}
        </IconDropdownMenu>
        <SecondaryBackgroundTooltip title={previewInviteTooltip}>
          <IconButton>
            <EyeIcon color="primary" fontSize="1.5rem" />
          </IconButton>
        </SecondaryBackgroundTooltip>
        <SecondaryBackgroundTooltip title={acceptInviteTooltip}>
          <IconButton>
            <CheckIcon color="success" fontSize="1.5rem" />
          </IconButton>
        </SecondaryBackgroundTooltip>
      </Stack>
    );
  };

  if (!isLoading && !invitations.length) {
    return <Alert severity="info"> {`No ${status.toLocaleLowerCase()} workspace invitations.`} </Alert>;
  }

  return (
    <WorkspaceTable
      items={filteredInvitations}
      isLoading={isLoading}
      itemType="invitation"
      filters={filters}
      tableFields={tableFields}
      initialSortField={initialSortField}
      endButtons={endButtons}
      showSeeMoreOption
    />
  );
});

export default InvitationsTable;
