import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';

function LocalStorageDescription() {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Description>Lists saved here are stored to your profile and accessible across devices.</Description>;
  }

  return <LoginAlert featureName="lists" />;
}

export default LocalStorageDescription;
