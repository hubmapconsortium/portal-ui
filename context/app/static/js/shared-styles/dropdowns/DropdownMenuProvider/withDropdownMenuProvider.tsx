import React from 'react';

import DropdownMenuProvider from './DropdownMenuProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withDropdownMenuProvider = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  isOpenToStart = false,
) =>
  function ComponentWithDropdownMenuProvider({ ...props }: P) {
    return (
      <DropdownMenuProvider isOpenToStart={isOpenToStart}>
        <Component {...props} />
      </DropdownMenuProvider>
    );
  };

export default withDropdownMenuProvider;
