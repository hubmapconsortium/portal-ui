import React, { PropsWithChildren } from 'react';
import Collapse from '@mui/material/Collapse';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import ClickableRow from 'js/shared-styles/tables/ClickableRow';
import { TableRowProps } from '@mui/material/TableRow';
import { useEventCallback } from '@mui/material/utils';
import { ExpandableRowProvider, useExpandableRowStore } from './store';
import { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon } from './style';

interface ExpandableRowChildProps extends PropsWithChildren, TableRowProps {
  numCells: number;
  disabled?: boolean;
  expandedContent: React.ReactNode;
  expandTooltip?: string;
  collapseTooltip?: string;
  disabledTooltipTitle?: string;
  reverse?: boolean;
  onExpand?: (isExpanded: boolean) => void;
}

function ExpandableRowChild({
  children,
  numCells,
  disabled,
  expandedContent,
  expandTooltip = '',
  collapseTooltip = '',
  disabledTooltipTitle,
  reverse = false,
  onExpand,
  ...rest
}: ExpandableRowChildProps) {
  const { isExpanded, toggleIsExpanded } = useExpandableRowStore();

  const tooltipTitle = isExpanded ? collapseTooltip : expandTooltip;

  const expandableCell = (
    <ExpandableRowCell padding="checkbox">
      <SecondaryBackgroundTooltip title={disabled ? disabledTooltipTitle : tooltipTitle}>
        <span>
          <StyledExpandCollapseIcon isExpanded={isExpanded} color={disabled ? 'disabled' : 'primary'} />
        </span>
      </SecondaryBackgroundTooltip>
    </ExpandableRowCell>
  );

  const onClick = useEventCallback(() => {
    toggleIsExpanded();
    onExpand?.(!isExpanded);
  });

  return (
    <>
      <ClickableRow {...rest} onClick={onClick} disabled={disabled} label="expand row">
        {reverse ? expandableCell : null}
        {children}
        {reverse ? null : expandableCell}
      </ClickableRow>
      <ExpandedRow $isExpanded={isExpanded}>
        <ExpandedCell colSpan={numCells} $isExpanded={isExpanded}>
          <Collapse in={isExpanded} timeout="auto" mountOnEnter>
            {expandedContent}
          </Collapse>
        </ExpandedCell>
      </ExpandedRow>
    </>
  );
}

interface ExpandableRowProps extends ExpandableRowChildProps {
  isExpandedToStart?: boolean;
}

function ExpandableRow({ isExpandedToStart, ...rest }: ExpandableRowProps) {
  return (
    <ExpandableRowProvider isExpandedToStart={isExpandedToStart}>
      <ExpandableRowChild {...rest} />
    </ExpandableRowProvider>
  );
}

export default ExpandableRow;
