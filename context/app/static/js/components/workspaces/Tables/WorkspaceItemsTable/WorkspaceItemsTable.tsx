import React, { useMemo } from 'react';
import { format } from 'date-fns/format';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/system/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';
import SvgIcon from '@mui/material/SvgIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { InternalLink } from 'js/shared-styles/Links';
import {
  getFieldPrefix,
  getFieldValue,
  getItemId,
  isInvitation,
  isSentInvitation,
  isWorkspace,
} from 'js/components/workspaces/utils';
import {
  CheckIcon,
  CloseFilledIcon,
  CloseIcon,
  DownIcon,
  EmailIcon,
  EyeIcon,
  MoreIcon,
  PendingRoundIcon,
  SuccessRoundIcon,
} from 'js/shared-styles/icons';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { LineClamp } from 'js/shared-styles/text';
import { TooltipButton, TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useInvitationsList, useWorkspacesList } from 'js/components/workspaces/hooks';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { LaunchStopButton } from 'js/components/workspaces/WorkspaceLaunchStopButtons/WorkspaceLaunchStopButtons';
import useWorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { RotatedTooltipButton } from 'js/shared-styles/buttons';
import { OrderIcon, SortDirection, getSortOrder } from 'js/shared-styles/tables/TableOrdering/TableOrdering';
import { workspaceStatusIconMap } from 'js/shared-styles/icons/workspaceStatusIconMap';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { CenteredAlert } from 'js/components/style';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';

import { TableField, WorkspaceItem, WorkspaceItemsTableProps } from './types';
import {
  ChipWrapper,
  CompactTableRow,
  ExpandedTableCell,
  ExpandedTableRow,
  StyledHeaderCell,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledButton,
  StyledTableContainer,
  StyledTableHead,
  StyledCheckboxCell,
  StyledSvgIcon,
  BorderedTableRow,
  StyledDescriptionContainer,
} from './style';

const tooltips = {
  expandRow: 'Show description',
  acceptInvite: 'Accept workspace copy invitation. This will create a copy of this workspace to your profile.',
  declineInvite: 'Decline invitation',
  deleteInvite: 'Delete invitation',
  previewInvite: 'Preview the details of this workspace',
  moreOptions: 'View additional actions',
};

function EndButtons({ item }: { item: WorkspaceItem }) {
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
          toastSuccessAcceptInvitation(item.shared_workspace_id.name);
          trackEvent({
            category: currentEventCategory,
            action: 'Workspace Invitations / Received / Accept Invite',
            label: itemId,
          });
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
      setInvitation(item);
      setDialogType('DECLINE_INVITATION');
    }
  });

  // If the item is a workspace
  if (isWorkspace(item)) {
    return (
      <Stack direction="row" justifyContent="end" marginRight={2}>
        <WorkspaceLaunchStopButtons
          workspace={item}
          button={LaunchStopButton}
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
          showLaunch
          showStop
        />
      </Stack>
    );
  }

  // If the item is an accepted invitation
  if (isAccepted) {
    return null;
  }

  // If the item is a pending sent invitation
  if (isSender) {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center">
        <IconDropdownMenu tooltip={tooltips.moreOptions} icon={MoreIcon} button={RotatedTooltipButton}>
          {options.map((props) => (
            <IconDropdownMenuItem key={props.icon.muiName} {...props} />
          ))}
        </IconDropdownMenu>
      </Stack>
    );
  }

  // If the item is a pending received invitation
  return (
    <Stack direction="row" justifyContent="end" alignItems="center">
      <TooltipIconButton tooltip={tooltips.declineInvite} onClick={onDeclineInvite}>
        <StyledSvgIcon as={CloseIcon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip={tooltips.previewInvite} onClick={onPreviewInvite}>
        <StyledSvgIcon as={EyeIcon} color="primary" />
      </TooltipIconButton>
      <TooltipIconButton tooltip={tooltips.acceptInvite} onClick={onAcceptInvite}>
        <StyledSvgIcon as={CheckIcon} color="success" />
      </TooltipIconButton>
    </Stack>
  );
}

function ItemCheckbox({
  showCheckbox,
  checked,
  onChange,
}: {
  showCheckbox: boolean;
  checked?: boolean;
  onChange: () => void;
}) {
  if (!showCheckbox) {
    return null;
  }

  return (
    <StyledCheckboxCell>
      <Checkbox checked={checked} onChange={onChange} />
    </StyledCheckboxCell>
  );
}

function SortHeaderCell({
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

    // Don't track the event if this is a workspaces table
    if (!status) {
      return;
    }

    if (currentEventCategory === WorkspacesEventCategories.WorkspaceLandingPage) {
      const action = `Workspace Invitations / ${status} / Sort Table`;
      trackEvent({
        category: currentEventCategory,
        action,
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

  return (
    <StyledHeaderCell>
      {label}
      <IconButton
        aria-label="Sort Column"
        onClick={handleClick}
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      >
        <OrderIcon direction={sortField.direction} isCurrentSortField={isCurrentSortField} />
      </IconButton>
    </StyledHeaderCell>
  );
}

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

function CellContent({ item, field }: { field: string; item: WorkspaceItem }) {
  const prefix = getFieldPrefix(field);
  const fieldValue = getFieldValue({ item, field });
  const itemId = getItemId(item);
  const email = getFieldValue({ item, field: 'user_id.email', prefix });

  const hasWorkspacePage = isWorkspace(item) || isSentInvitation(item) || getFieldValue({ item, field: 'is_accepted' });

  const { currentEventCategory } = useWorkspacesEventContext();

  const trackNameClick = useEventCallback(() => {
    if (!hasWorkspacePage) {
      trackEvent({
        category: currentEventCategory,
        action: 'Workspace Invitations / Received / Open Preview',
        label: `${itemId} Select Workspace Name`,
      });
    }
  });

  const handleEmailClick = useEventCallback(() => {
    window.location.href = `mailto:${email}`;

    trackEvent({
      category: currentEventCategory,
      action: 'Workspace Invitations / Received / Open Email',
      label: itemId,
    });
  });

  switch (field) {
    case `${prefix}name`: {
      const href = hasWorkspacePage ? `/workspaces/${itemId}` : `/invitations/${itemId}`;

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <InternalLink href={href} onClick={trackNameClick}>
            <LineClamp lines={1}>{fieldValue}</LineClamp>
          </InternalLink>
          <Box>{`(ID: ${itemId})`}</Box>
          <InvitationStatusIcon item={item} />
        </Stack>
      );
    }
    case `${prefix}user_id.username`: {
      if ('user_id' in item && !item.user_id) {
        return <Typography>Me</Typography>;
      }

      const firstName = getFieldValue({ item, field: 'user_id.first_name', prefix });
      const lastName = getFieldValue({ item, field: 'user_id.last_name', prefix });

      return (
        <Stack direction="row" alignItems="center">
          <Typography>{`${firstName} ${lastName}`}</Typography>
          <TooltipButton sx={{ minWidth: 0 }} tooltip={`Mail to ${email}`} onClick={handleEmailClick}>
            <EmailIcon color="info" />
          </TooltipButton>
        </Stack>
      );
    }
    case `${prefix}datetime_created`:
    case `${prefix}datetime_share_created`:
    case `${prefix}datetime_last_job_launch`: {
      const date = fieldValue ?? getFieldValue({ item, field: 'datetime_created', prefix });
      return format(date, 'yyyy-MM-dd');
    }
    case 'status': {
      const { icon, color } = workspaceStatusIconMap[fieldValue];
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{fieldValue}</Typography>
          <SvgIcon fontSize=".9rem" component={icon} color={color} />
        </Stack>
      );
    }
    default:
      return <Typography>{fieldValue}</Typography>;
  }
}

interface RowProps<T extends WorkspaceItem> {
  item: T;
  tableFields: TableField[];
  selectedItemIds?: Set<string>;
  toggleItem?: (itemId: string) => void;
}

const ResultRow = React.memo(function ResultRow<T extends WorkspaceItem>({
  item,
  tableFields,
  selectedItemIds,
  toggleItem,
}: RowProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { currentEventCategory } = useWorkspacesEventContext();
  const itemId = isWorkspace(item) ? item.id.toString() : item.original_workspace_id.id.toString();

  const handleDescriptionClick = useEventCallback(() => {
    setIsExpanded(!isExpanded);

    trackEvent({
      category: currentEventCategory,
      action: 'Workspace Invitations / Description / Expand Row',
      label: itemId,
    });
  });

  const prefix = getFieldPrefix(tableFields[0].field);
  const description = getFieldValue({ item, field: 'description', prefix });
  const TableRowComponent: React.ElementType = description ? CompactTableRow : BorderedTableRow;

  return (
    <>
      <TableRowComponent sx={{ '& > *': { borderBottom: 'unset' } }}>
        <ItemCheckbox
          showCheckbox={!!selectedItemIds}
          checked={selectedItemIds?.has(itemId)}
          onChange={() => toggleItem?.(itemId)}
        />
        <StyledTableCell width="0">
          {description && (
            <TooltipIconButton
              tooltip={!isExpanded && tooltips.expandRow}
              aria-label="expand row"
              size="small"
              onClick={handleDescriptionClick}
            >
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </TooltipIconButton>
          )}
        </StyledTableCell>
        {tableFields.map(({ field }) => (
          <StyledTableCell key={field}>
            <CellContent field={field} item={item} />
          </StyledTableCell>
        ))}
        <StyledTableCell>
          <EndButtons item={item} />
        </StyledTableCell>
      </TableRowComponent>
      {description && (
        <ExpandedTableRow>
          {selectedItemIds && toggleItem && <ExpandedTableCell />}
          <ExpandedTableCell />
          <ExpandedTableCell colSpan={tableFields.length + 1}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <StyledDescriptionContainer>{description}</StyledDescriptionContainer>
            </Collapse>
          </ExpandedTableCell>
        </ExpandedTableRow>
      )}
    </>
  );
});

const HeaderCells = React.memo(function HeaderCells(props: {
  tableFields: TableField[];
  sortField: { direction: SortDirection; field: string };
  setSortField: React.Dispatch<React.SetStateAction<{ direction: SortDirection; field: string }>>;
  status?: string;
}) {
  const { tableFields, ...rest } = props;
  return (
    <>
      {tableFields.map(({ field, label }) => (
        <SortHeaderCell key={field} field={field} label={label} {...rest} />
      ))}
    </>
  );
});

function SeeMoreRows({
  showSeeMoreOption,
  numVisibleItems,
  setNumVisibleItems,
  totalItems,
}: {
  showSeeMoreOption?: boolean;
  numVisibleItems: number;
  setNumVisibleItems: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}) {
  const { currentEventCategory } = useWorkspacesEventContext();

  const handleClick = useEventCallback(() => {
    setNumVisibleItems((prev) => prev + 3);

    trackEvent({
      category: currentEventCategory,
      action: 'Workspace Invitations / Received / See More',
    });
  });

  if (!showSeeMoreOption || numVisibleItems >= totalItems) {
    return null;
  }

  return (
    <StyledButton variant="text" onClick={handleClick} fullWidth>
      <Stack direction="row" spacing={1} marginY={0.5} alignItems="center">
        <Typography variant="button">See More</Typography>
        <DownIcon />
      </Stack>
    </StyledButton>
  );
}

function LoadingRows({ tableWidth }: { tableWidth: number }) {
  return Array.from({ length: 3 }, (i, rowIndex) => (
    <TableRow key={`row-${rowIndex}`}>
      {Array.from({ length: tableWidth }, (j, cellIndex) => (
        <StyledTableCell key={`cell-${rowIndex}-${cellIndex}`}>
          <Skeleton variant="text" />
        </StyledTableCell>
      ))}
    </TableRow>
  ));
}

function TableResults<T extends WorkspaceItem>({
  isLoading,
  sortedItems,
  tableFields,
  numVisibleItems,
  selectedItemIds,
  toggleItem,
}: {
  sortedItems: T[];
  numVisibleItems: number;
} & Pick<WorkspaceItemsTableProps<T>, 'isLoading' | 'tableFields' | 'selectedItemIds' | 'toggleItem'>) {
  if (isLoading) {
    return <LoadingRows tableWidth={tableFields.length + 1} />;
  }

  return sortedItems
    .slice(0, numVisibleItems)
    .map((item) => (
      <ResultRow
        key={isWorkspace(item) ? item.id : item.shared_workspace_id.id}
        item={item}
        tableFields={tableFields}
        selectedItemIds={selectedItemIds}
        toggleItem={toggleItem}
      />
    ));
}

function TableContent<T extends WorkspaceItem>(props: WorkspaceItemsTableProps<T>) {
  const { items, isLoading, itemType, tableFields, toggleItem, selectedItemIds, showSeeMoreOption, ...rest } = props;

  const {
    noFiltersSelected,
    sortedItems,
    sortField,
    setSortField,
    numVisibleItems,
    setNumVisibleItems,
    onToggleAllItems,
  } = useWorkspaceItemsTable<T>(props);

  if (!isLoading && noFiltersSelected) {
    return (
      <StyledTableContainer sx={(theme) => ({ padding: theme.spacing(2) })}>
        <StyledTable>
          <CenteredAlert severity="info">No {itemType}s to display based on current filters.</CenteredAlert>
        </StyledTable>
      </StyledTableContainer>
    );
  }

  return (
    <>
      <StyledTableContainer sx={{ maxHeight: showSeeMoreOption ? 'inherit' : '425px' }}>
        <StyledTable>
          <StyledTableHead>
            {!!selectedItemIds && (
              <StyledHeaderCell>
                <Checkbox checked={selectedItemIds?.size === items.length} onChange={onToggleAllItems} />
              </StyledHeaderCell>
            )}
            <StyledTableCell width="0" />
            <HeaderCells tableFields={tableFields} sortField={sortField} setSortField={setSortField} {...rest} />
            <StyledTableCell />
          </StyledTableHead>
          <StyledTableBody>
            <TableResults
              isLoading={isLoading}
              sortedItems={sortedItems}
              tableFields={tableFields}
              numVisibleItems={numVisibleItems}
              selectedItemIds={selectedItemIds}
              toggleItem={toggleItem}
            />
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>
      <SeeMoreRows
        showSeeMoreOption={showSeeMoreOption}
        numVisibleItems={numVisibleItems}
        setNumVisibleItems={setNumVisibleItems}
        totalItems={items.length}
      />
    </>
  );
}

function WorkspaceItemsTable<T extends WorkspaceItem>(props: WorkspaceItemsTableProps<T>) {
  const { filters, status, itemType } = props;

  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();

  const handleClick = useEventCallback((label: string, setShow: React.Dispatch<React.SetStateAction<boolean>>) => {
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

  return (
    <Box>
      <ChipWrapper>
        {filters.map(({ label, show, setShow, disabled }) => (
          <SelectableChip
            key={label}
            label={label}
            isSelected={show}
            onClick={() => handleClick(label, setShow)}
            disabled={disabled}
          />
        ))}
      </ChipWrapper>
      <TableContent {...props} />
    </Box>
  );
}

export default WorkspaceItemsTable;
