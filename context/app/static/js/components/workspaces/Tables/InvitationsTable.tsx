import React, { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/system/Stack';

import { WorkspaceInvitation, WorkspaceWithUserId } from 'js/components/workspaces/types';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import WorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/WorkspaceItemsTable';
import { Alert } from 'js/shared-styles/alerts/Alert';
import { CheckIcon, CloseFilledIcon, EyeIcon, MoreIcon } from 'js/shared-styles/icons';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { RotatedTooltipButton } from 'js/shared-styles/buttons';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { LaunchStopButton } from 'js/components/workspaces/WorkspaceLaunchStopButtons/WorkspaceLaunchStopButtons';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { getFieldValue } from 'js/components/workspaces/utils';

const acceptInviteTooltip =
  'Accept workspace copy invitation. This will create a copy of this workspace to your profile.';
const previewInviteTooltip = 'Preview the details of this workspace.';
const moreOptionsTooltip = 'View additional actions.';

const initialSortField: SortField = {
  field: 'datetime_share_created',
  direction: 'desc',
};

const options = [
  {
    children: 'Decline Invitation',
    // TODO: update once dialog is implemented
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick: () => {},
    icon: CloseFilledIcon,
  },
];

function EndButtons(item: WorkspaceInvitation | WorkspaceWithUserId) {
  const { handleStopWorkspace, isStoppingWorkspace, workspacesList } = useWorkspacesList();
  const isAccepted = getFieldValue({ item, field: 'is_accepted' });

  // If the invite has been accepted, show the launch/stop workspace buttons
  if (isAccepted && 'shared_workspace_id' in item) {
    const { shared_workspace_id } = item;
    const workspace = workspacesList.find((w) => w.id === shared_workspace_id.id);

    if (!workspace) {
      return null;
    }

    return (
      <Stack alignItems="end" marginRight={2}>
        <WorkspaceLaunchStopButtons
          workspace={workspace}
          button={LaunchStopButton}
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
          showLaunch
          showStop
        />
      </Stack>
    );
  }

  // If the invite has not been accepted, show the accept/decline/preview buttons
  return (
    <Stack direction="row" justifyContent="end" alignItems="center">
      <IconDropdownMenu tooltip={moreOptionsTooltip} icon={MoreIcon} button={RotatedTooltipButton}>
        {options.map((props) => (
          <IconDropdownMenuItem key={props.children} {...props} />
        ))}
      </IconDropdownMenu>
      <TooltipIconButton tooltip={previewInviteTooltip}>
        <EyeIcon color="primary" fontSize="1.5rem" />
      </TooltipIconButton>
      <TooltipIconButton tooltip={acceptInviteTooltip}>
        <CheckIcon color="primary" fontSize="1.5rem" />
      </TooltipIconButton>
    </Stack>
  );
}

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
      EndButtons={EndButtons}
      showSeeMoreOption
    />
  );
});

export default InvitationsTable;
