import React, { PropsWithChildren } from 'react';
import Collapse from '@mui/material/Collapse';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import ClickableRow from 'js/shared-styles/tables/ClickableRow';
import { ExpandableRowProvider, useExpandableRowStore } from './store';
import { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon } from './style';

interface ExpandableRowChildProps extends PropsWithChildren {
  numCells: number;
  disabled?: boolean;
  expandedContent: React.ReactElement;
  disabledTooltipTitle: string;
}

function ExpandableRowChild({
  children,
  numCells,
  disabled,
  expandedContent,
  disabledTooltipTitle,
}: ExpandableRowChildProps) {
  const { isExpanded, toggleIsExpanded } = useExpandableRowStore();

  return (
    <>
      <ClickableRow onClick={toggleIsExpanded} disabled={disabled} label="expand row">
        {children}
        <ExpandableRowCell>
          <SecondaryBackgroundTooltip title={disabled ? disabledTooltipTitle : ''}>
            <span>
              <StyledExpandCollapseIcon isExpanded={isExpanded} color={disabled ? 'disabled' : 'primary'} />
            </span>
          </SecondaryBackgroundTooltip>
        </ExpandableRowCell>
      </ClickableRow>
      <ExpandedRow $isExpanded={isExpanded}>
        <ExpandedCell colSpan={numCells} $isExpanded={isExpanded}>
          <Collapse in={isExpanded} timeout="auto">
            {React.cloneElement(expandedContent, {
              isExpanded,
            })}
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
