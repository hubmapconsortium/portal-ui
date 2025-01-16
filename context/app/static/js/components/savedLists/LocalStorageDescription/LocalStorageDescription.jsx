import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';

function LocalStorageDescription() {
  const { isAuthenticated } = useAppContext()

  if (isAuthenticated) {
    return null;
  }

  return (
    <Description padding="20px">
      Your lists are currently stored on local storage and are not transferable between devices.
    </Description>
  );
}

export default LocalStorageDescription;
