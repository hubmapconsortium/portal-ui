import React from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function SelectableTableProvider({ children, tableLabel }) {
  return <Provider createStore={() => createStore(tableLabel)}>{children}</Provider>;
}

export const withSelectableTableProvider = (Component, tableLabel) =>
  function ({ ...props }) {
    return (
      <SelectableTableProvider tableLabel={tableLabel}>
        <Component {...props} />
      </SelectableTableProvider>
    );
  };

SelectableTableProvider.propTypes = {
  /**
     Label for the table used for aria attributes.
    */
  tableLabel: PropTypes.string.isRequired,
};

export default SelectableTableProvider;
