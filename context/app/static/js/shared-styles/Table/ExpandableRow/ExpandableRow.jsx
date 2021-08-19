import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import ExpandableRowCell from 'js/shared-styles/Table/ExpandableRowCell';
import { Provider, createStore, useStore } from './store';

function ExpandableRowChild({ children, numCells, expandedContent }) {
  const { isExpanded, toggleIsExpanded } = useStore();

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
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={numCells}>{expandedContent}</TableCell>
        </TableRow>
      )}
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
