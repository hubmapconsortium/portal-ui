import React, { useRef } from 'react';

import { animated } from 'react-spring';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useExpandSpring } from 'js/hooks/useExpand';
import ClickableRow from 'js/shared-styles/tables/ClickableRow';
import { Provider, createStore, useStore } from './store';
import { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon } from './style';

function ExpandableRowChild({ children, numCells, disabled, expandedContent, disabledTooltipTitle }) {
  const { isExpanded, toggleIsExpanded } = useStore();
  const heightRef = useRef(null);
  const styles = useExpandSpring(heightRef, 0, isExpanded);

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
          <animated.div style={styles}>
            {React.cloneElement(expandedContent, {
              heightRef,
              isExpanded,
            })}
          </animated.div>
        </ExpandedCell>
      </ExpandedRow>
    </>
  );
}

function ExpandableRow(props) {
  return (
    <Provider createStore={createStore}>
      <ExpandableRowChild {...props} />
    </Provider>
  );
}

export default ExpandableRow;
