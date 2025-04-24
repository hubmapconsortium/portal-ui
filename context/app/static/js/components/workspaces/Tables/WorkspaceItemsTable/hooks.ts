import { useEffect, useMemo, useState } from 'react';
import useEventCallback from '@mui/material/utils/useEventCallback';
import {
  SortField,
  TableField,
  WorkspaceItem,
  WorkspaceItemsTableProps,
} from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import {
  getFieldPrefix,
  getFieldValue,
  getItemId,
  isInvitation,
  isSentInvitation,
  isWorkspace,
} from 'js/components/workspaces/utils';
import { useInvitationsList, useWorkspacesList } from 'js/components/workspaces/hooks';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';
import { trackEvent } from 'js/helpers/trackers';
import { CloseFilledIcon } from 'js/shared-styles/icons';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { getSortOrder } from 'js/shared-styles/tables/TableOrdering';
import { SortDirection } from 'js/shared-styles/tables/TableOrdering/TableOrdering';

export function useWorkspaceItemsTable({ itemType, status }: { itemType: string; status?: string }) {
  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();

  const trackFilterClick = useEventCallback((label: string, setShow: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShow((prev) => !prev);

    if (currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage) {
      const action = itemType === 'workspace' ? 'Select Filter' : `Workspace Invitations / ${status} / Select Filter`;

      trackEvent({
        category: currentEventCategory,
        action,
        label,
      });
    }

    if (currentEventCategory === WorkspacesEventCategories.WorkspaceDetailPage) {
      trackEvent({
        category: currentEventCategory,
        action: 'Sent Invitations Status / Select Filter',
        label: `${currentWorkspaceItemId} ${label}`,
      });
    }
  });

  return {
    trackFilterClick,
  };
}

export function useSeeMoreRows({
  setNumVisibleItems,
}: {
  setNumVisibleItems: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { currentEventCategory, currentWorkspaceItemName } = useWorkspacesEventContext();
  const isFromLandingPage = currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage;

  const trackSeeMoreClick = useEventCallback(() => {
    setNumVisibleItems((prev) => prev + 3);

    trackEvent({
      category: currentEventCategory,
      action: `${isFromLandingPage ? 'Workspace Invitations / Received /' : 'Sent Invitations Status /'} See More`,
      label: isFromLandingPage ? null : currentWorkspaceItemName,
    });
  });

  return {
    trackSeeMoreClick,
  };
}

export function useResultRow<T extends WorkspaceItem>({ item, tableFields }: { item: T; tableFields: TableField[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentEventCategory, currentWorkspaceItemName } = useWorkspacesEventContext();
  const isFromLandingPage = currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage;

  const itemId = getItemId(item).toString();

  const handleDescriptionClick = useEventCallback(() => {
    setIsExpanded((prev) => !prev);

    trackEvent({
      category: currentEventCategory,
      action: `${isFromLandingPage ? 'Workspace Invitations / Received /' : 'Sent Invitations Status /'} Expand Row`,
      label: isFromLandingPage ? itemId : `${currentWorkspaceItemName} ${itemId}`,
    });
  });

  const prefix = getFieldPrefix(tableFields[0].field);
  const description = getFieldValue({ item, field: 'description', prefix });

  return {
    isExpanded,
    handleDescriptionClick,
    description,
    itemId,
    isFromLandingPage,
  };
}

export function useWorkspaceItemsTableContent<T extends WorkspaceItem>({
  items,
  initialSortField,
  showSeeMoreOption,
  filters,
  toggleAllItems,
}: WorkspaceItemsTableProps<T>) {
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [numVisibleItems, setNumVisibleItems] = useState(3);

  useEffect(() => {
    setNumVisibleItems(showSeeMoreOption ? 3 : items.length);
  }, [items, showSeeMoreOption]);

  const noFiltersSelected = useMemo(() => filters.every(({ show }) => !show), [filters]);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aValue = getFieldValue({ item: a, field: sortField.field });
        const bValue = getFieldValue({ item: b, field: sortField.field });

        if (aValue < bValue) return sortField.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortField.direction === 'asc' ? 1 : -1;
        return 0;
      }),
    [items, sortField],
  );

  const onToggleAllItems = useEventCallback(() => {
    const itemIds = items
      .map((item) => (isWorkspace(item) ? item.id.toString() : (item.original_workspace_id?.id?.toString() ?? null)))
      .filter((id): id is string => id !== null);

    toggleAllItems?.(itemIds);
  });

  return {
    numVisibleItems,
    setNumVisibleItems,
    noFiltersSelected,
    sortedItems,
    sortField,
    setSortField,
    onToggleAllItems,
  };
}

export function useSortHeaderCell({
  field,
  label,
  sortField,
  setSortField,
  status,
}: {
  field: string;
  label: string;
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
  status?: string;
}) {
  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();
  const isCurrentSortField = field === sortField.field;

  const handleClick = useEventCallback(() => {
    const newSortDirection = getSortOrder({ direction: sortField.direction, isCurrentSortField });
    setSortField({ direction: newSortDirection, field });

    if (!status) return;

    if (currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage) {
      trackEvent({
        category: currentEventCategory,
        action: `Workspace Invitations / ${status} / Sort Table`,
        label,
      });
    }

    if (currentEventCategory === WorkspacesEventCategories.WorkspaceDetailPage) {
      trackEvent({
        category: currentEventCategory,
        action: 'Datasets / Sort Columns',
        label: `${currentWorkspaceItemId} ${label}`,
      });
    }
  });

  return {
    isCurrentSortField,
    handleClick,
  };
}

export function useCellContent(item: WorkspaceItem, field: string) {
  const prefix = getFieldPrefix(field);
  const fieldValue = getFieldValue({ item, field });
  const itemId = getFieldValue({ item, field: 'id', prefix });
  const hasWorkspacePage = isWorkspace(item) || isSentInvitation(item) || getFieldValue({ item, field: 'is_accepted' });

  const { currentEventCategory, currentWorkspaceItemName } = useWorkspacesEventContext();
  const isFromLandingPage = currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage;

  const handleTrackEvent = useEventCallback((actionSuffix: string) => {
    const action = isFromLandingPage
      ? `Workspace Invitations / Received / ${actionSuffix}`
      : `Sent Invitations Status / ${actionSuffix}`;
    const label = isFromLandingPage ? itemId : `${currentWorkspaceItemName} ${itemId}`;

    trackEvent({
      category: currentEventCategory,
      action,
      label,
    });
  });

  const trackNameClick = useEventCallback(() => {
    if (!hasWorkspacePage) {
      handleTrackEvent('Open Preview');
    }
  });

  const handleEmailClick = useEventCallback((email: string) => {
    window.location.href = `mailto:${email}`;
    handleTrackEvent('Open Email');
  });

  return {
    prefix,
    fieldValue,
    itemId,
    hasWorkspacePage,
    handleTrackEvent,
    trackNameClick,
    handleEmailClick,
  };
}

export function useEndButtons(item: WorkspaceItem) {
  const { handleStopWorkspace, isStoppingWorkspace } = useWorkspacesList();
  const { handleAcceptInvitation } = useInvitationsList();
  const { setDialogType, setInvitation } = useEditWorkspaceStore();
  const { toastErrorAcceptInvitation, toastSuccessAcceptInvitation } = useWorkspaceToasts();
  const { currentEventCategory } = useWorkspacesEventContext();

  const isSender = isSentInvitation(item);
  const isAccepted = getFieldValue({ item, field: 'is_accepted' });
  const itemId = getItemId(item);

  const options = useMemo(
    () => [
      {
        children: `${isSender ? 'Delete' : 'Decline'} Invitation`,
        onClick: () => {
          const dialogType = isSender ? 'DELETE_INVITATION' : 'DECLINE_INVITATION';
          if (isInvitation(item)) {
            setInvitation(item);
            setDialogType(dialogType);
          }
        },
        icon: CloseFilledIcon,
      },
    ],
    [isSender, item, setDialogType, setInvitation],
  );

  const onAcceptInvite = useEventCallback(() => {
    if (isInvitation(item)) {
      handleAcceptInvitation(itemId)
        .then(() => {
          trackEvent({
            category: currentEventCategory,
            action: 'Workspace Invitations / Received / Accept Invite',
            label: itemId,
          });
          toastSuccessAcceptInvitation(item.shared_workspace_id.name);
        })
        .catch((e) => {
          console.error(e);
          toastErrorAcceptInvitation(item.shared_workspace_id.name);
        });
    }
  });

  const onPreviewInvite = useEventCallback(() => {
    if (isInvitation(item)) {
      trackEvent({
        category: currentEventCategory,
        action: 'Workspace Invitations / Received / Open Preview',
        label: `${itemId} Preview Icon Button`,
      });

      window.location.href = `/invitations/${itemId}`;
    }
  });

  const onDeclineInvite = useEventCallback(() => {
    if (isInvitation(item)) {
      trackEvent({
        category: currentEventCategory,
        action: 'Workspace Invitations / Received / Open Decline Invite Dialog',
        label: itemId,
      });

      setInvitation(item);
      setDialogType('DECLINE_INVITATION');
    }
  });

  return {
    isAccepted,
    isSender,
    itemId,
    options,
    onAcceptInvite,
    onPreviewInvite,
    onDeclineInvite,
    handleStopWorkspace,
    isStoppingWorkspace,
  };
}
