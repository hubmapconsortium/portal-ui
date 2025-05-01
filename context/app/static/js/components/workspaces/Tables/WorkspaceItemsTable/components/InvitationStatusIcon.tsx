import React from 'react';
import { WorkspaceItem } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { getFieldValue, isWorkspace } from 'js/components/workspaces/utils';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { PendingRoundIcon, SuccessRoundIcon } from 'js/shared-styles/icons';

function InvitationStatusIcon({ item }: { item: WorkspaceItem }) {
  if (isWorkspace(item)) {
    return null;
  }

  const isAccepted = getFieldValue({ item, field: 'is_accepted' });

  if (isAccepted) {
    return (
      <SecondaryBackgroundTooltip title="Accepted workspace invitation">
        <SuccessRoundIcon color="success" fontSize=".9rem" />
      </SecondaryBackgroundTooltip>
    );
  }

  return (
    <SecondaryBackgroundTooltip title="Pending workspace invitation">
      <PendingRoundIcon color="info" fontSize=".9rem" />
    </SecondaryBackgroundTooltip>
  );
}

export default InvitationStatusIcon;
