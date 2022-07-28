import React, { useRef } from 'react';

import { animated } from 'react-spring';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { useExpandSpring } from 'js/hooks/useExpand';
import { Provider, createStore, useStore } from './store';
import { ClickableRow, ExpandedRow, ExpandedCell, StyledExpandCollapseIcon } from './style';

function ExpandableRowChild({ children, numCells, expandedContent, disabled }) {
  const { isExpanded, toggleIsExpanded } = useStore();
  const heightRef = useRef(null);
  const styles = useExpandSpring(heightRef, 0, isExpanded);

  return (
    <>
      <ClickableRow onClick={toggleIsExpanded}>
        {children}
        <ExpandableRowCell>
          <StyledExpandCollapseIcon
            isExpanded={isExpanded}
            aria-label="expand row"
            color={disabled ? 'disabled' : 'primary'}
          />
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
