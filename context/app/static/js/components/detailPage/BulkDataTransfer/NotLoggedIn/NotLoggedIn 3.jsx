import React from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';

import ProtectedData from './ProtectedData';
import PublicData from './PublicData';

function NotLoggedIn() {
  const {
    entity: { mapped_data_access_level: accessType },
  } = useFlaskDataContext();

  return accessType === 'Protected' ? <ProtectedData /> : <PublicData />;
}

export default NotLoggedIn;
