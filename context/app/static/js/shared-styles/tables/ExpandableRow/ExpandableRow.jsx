import React, { useRef } from 'react';

import { animated } from 'react-spring';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { useExpandSpring } from 'js/hooks/useExpand';
import DisabledButtonTooltip from 'js/shared-styles/tooltips/DisabledButtonTooltip';
import { Provider, createStore, useStore } from './store';
import { ClickableRow, ExpandedRow, ExpandedCell, StyledExpandCollapseIconButton } from './style';

function ExpandableRowChild({ children, numCells, expandedContent, disabled, buttonTooltipTitle }) {
  const { isExpanded, toggleIsExpanded } = useStore();
  const heightRef = useRef(null);
  const styles = useExpandSpring(heightRef, 0, isExpanded);

  const iconButtonProps = {
    isExpanded,
    'aria-label': 'expand row',
  };

  return (
    <>
      <ClickableRow onClick={toggleIsExpanded}>
        {children}
        <ExpandableRowCell>
          {disabled ? (
            <DisabledButtonTooltip title={buttonTooltipTitle}>
              <StyledExpandCollapseIconButton {...iconButtonProps} disabled />
            </DisabledButtonTooltip>
          ) : (
            <StyledExpandCollapseIconButton {...iconButtonProps} color="primary" />
          )}
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
