import React from 'react';
import { format } from 'date-fns/format';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/system/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { InternalLink } from 'js/shared-styles/Links';
import { getFieldValue, getItemId, isWorkspace } from 'js/components/workspaces/utils';
import {
  CheckIcon,
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
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { LaunchStopButton } from 'js/components/workspaces/WorkspaceLaunchStopButtons/WorkspaceLaunchStopButtons';
import {
  useEndButtons,
  useWorkspaceItemsTableContent,
  useWorkspaceItemsTable,
  useSeeMoreRows,
  useResultRow,
  useSortHeaderCell,
  useCellContent,
} from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { RotatedTooltipButton } from 'js/shared-styles/buttons';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { OrderIcon, SortDirection } from 'js/shared-styles/tables/TableOrdering/TableOrdering';
import { workspaceStatusIconMap } from 'js/shared-styles/icons/workspaceStatusIconMap';
import { CenteredAlert } from 'js/components/style';

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
  const {
    isAccepted,
    isSender,
    options,
    onAcceptInvite,
    onPreviewInvite,
    onDeclineInvite,
    handleStopWorkspace,
    isStoppingWorkspace,
  } = useEndButtons(item);

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
  const { isCurrentSortField, handleClick } = useSortHeaderCell({
    field,
    label,
    sortField,
    setSortField,
    status,
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
  const { prefix, fieldValue, itemId, hasWorkspacePage, trackNameClick, handleEmailClick } = useCellContent(
    item,
    field,
  );

  switch (field) {
    case `${prefix}name`: {
      const href = hasWorkspacePage ? `/workspaces/${itemId}` : `/invitations/${itemId}`;

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <InternalLink href={href} onClick={trackNameClick}>
            <LineClamp lines={1}>{fieldValue}</LineClamp>
          </InternalLink>
          {/* We retrieve the ID this way here because we want to show the shared IDs (which will be distinct)
           for sent workspace invites, which can be shared multiple times. */}
          <Box>{`(ID: ${getItemId(item)})`}</Box>
          <InvitationStatusIcon item={item} />
        </Stack>
      );
    }
    case `${prefix}user_id.username`:
    case `${prefix}creatorInfo`: {
      const isCreatorInfo = field === `${prefix}creatorInfo`;

      if (fieldValue === 'Me') {
        return <Typography>Me</Typography>;
      }

      if (fieldValue === 'Unknown') {
        return (
          <Stack direction="row" alignItems="center">
            <Typography>Unknown</Typography>
            <InfoTooltipIcon iconTooltipText="Original creator has deleted workspace" />
          </Stack>
        );
      }

      const baseField = isCreatorInfo ? 'creatorInfo' : 'user_id';
      const firstName = getFieldValue({ item, field: `${baseField}.first_name`, prefix });
      const lastName = getFieldValue({ item, field: `${baseField}.last_name`, prefix });
      const email = getFieldValue({ item, field: `${baseField}.email`, prefix });

      return (
        <Stack direction="row" alignItems="center">
          <Typography>{`${firstName} ${lastName}`}</Typography>
          <TooltipButton sx={{ minWidth: 0 }} tooltip={`Mail to ${email}`} onClick={() => handleEmailClick(email)}>
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
  const { isExpanded, handleDescriptionClick, description, itemId } = useResultRow({ item, tableFields });
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
  const { trackSeeMoreClick } = useSeeMoreRows({ setNumVisibleItems });

  if (!showSeeMoreOption || numVisibleItems >= totalItems) {
    return null;
  }

  return (
    <StyledButton variant="text" onClick={trackSeeMoreClick} fullWidth>
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
      {Array.from({ length: tableWidth + 1 }, (j, cellIndex) => (
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
  } = useWorkspaceItemsTableContent(props);

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
  const { trackFilterClick } = useWorkspaceItemsTable({ itemType, status });

  return (
    <Box>
      <ChipWrapper>
        {filters.map(({ label, show, setShow, disabled }) => (
          <SelectableChip
            key={label}
            label={label}
            isSelected={show}
            onClick={() => trackFilterClick(label, setShow)}
            disabled={disabled}
          />
        ))}
      </ChipWrapper>
      <TableContent {...props} />
    </Box>
  );
}

export default WorkspaceItemsTable;
