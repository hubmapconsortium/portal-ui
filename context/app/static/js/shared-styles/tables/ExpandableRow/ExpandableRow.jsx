import React, { useRef } from 'react';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';
import { animated } from 'react-spring';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { useExpandSpring } from 'js/hooks/useExpand';
import { Provider, createStore, useStore } from './store';
import { ExpandedRow, ExpandedCell } from './style';

function ExpandableRowChild({ children, numCells, expandedContent }) {
  const { isExpanded, toggleIsExpanded } = useStore();
  const heightRef = useRef(null);
  const styles = useExpandSpring(heightRef, 0, isExpanded);

  return (
    <>
      <TableRow>
        {children}
        <ExpandableRowCell>
          <IconButton onClick={toggleIsExpanded} aria-label="expand row">
            {isExpanded ? (
              <ArrowDropUpRoundedIcon data-testid="up-arrow-icon" />
            ) : (
              <ArrowDropDownRoundedIcon data-testid="down-arrow-icon" />
            )}
          </IconButton>
        </ExpandableRowCell>
      </TableRow>
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
