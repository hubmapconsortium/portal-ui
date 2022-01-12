import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Provider, createStore } from './store';

function DropdownMenuProvider({ children, isOpenToStart }) {
  const ref = useRef(); // ref must be passed to store and not created inside
  return <Provider createStore={() => createStore(isOpenToStart, ref)}>{children}</Provider>;
}

DropdownMenuProvider.propTypes = {
  isOpenToStart: PropTypes.bool,
};

DropdownMenuProvider.defaultProps = {
  isOpenToStart: false,
};

export default DropdownMenuProvider;
