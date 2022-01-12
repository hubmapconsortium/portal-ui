import React from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function DropdownMenuProvider({ children, isOpenToStart }) {
  return <Provider createStore={() => createStore(isOpenToStart)}>{children}</Provider>;
}

DropdownMenuProvider.propTypes = {
  isOpenToStart: PropTypes.bool,
};

DropdownMenuProvider.defaultProps = {
  isOpenToStart: false,
};

export default DropdownMenuProvider;
