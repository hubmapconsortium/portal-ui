import React from 'react';

import DropdownMenuProvider from './DropdownMenuProvider';

const withDropdownMenuProvider =
  (Component, isOpenToStart) =>
  ({ ...props }) =>
    (
      <DropdownMenuProvider isOpenToStart={isOpenToStart}>
        <Component {...props} />
      </DropdownMenuProvider>
    );

export default withDropdownMenuProvider;
