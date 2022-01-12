import React from 'react';

import { Provider, createStore } from './store';

function DropdownMenuProvider({ children, isOpenToStart }) {
  return <Provider createStore={() => createStore(isOpenToStart)}>{children}</Provider>;
}

export default DropdownMenuProvider;
