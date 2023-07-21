import React from 'react';
import Collapse from '@mui/material/Collapse';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import ClickableRow from 'js/shared-styles/tables/ClickableRow';
import { Provider, createStore, useStore } from './store';
import { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon } from './style';

function ExpandableRowChild({ children, numCells, disabled, expandedContent, disabledTooltipTitle }) {
  const { isExpanded, toggleIsExpanded } = useStore();

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

function ExpandableRow({ isExpandedToStart, ...rest }) {
  return (
    <Provider createStore={() => createStore(isExpandedToStart)}>
      <ExpandableRowChild {...rest} />
    </Provider>
  );
}

export default ExpandableRow;
