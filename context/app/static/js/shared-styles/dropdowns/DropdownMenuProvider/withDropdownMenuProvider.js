import React from 'react';

import DropdownMenuProvider from './DropdownMenuProvider';

const withDropdownMenuProvider = (Component, isOpenToStart) =>
  function ({ ...props }) {
    return (
      <DropdownMenuProvider isOpenToStart={isOpenToStart}>
        <Component {...props} />
      </DropdownMenuProvider>
    );
  };

export default withDropdownMenuProvider;
