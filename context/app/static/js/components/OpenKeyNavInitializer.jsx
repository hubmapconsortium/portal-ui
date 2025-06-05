import React from 'react';
import OpenKeyNav from 'openkeynav';

import { useSavedPreferences } from 'js/components/savedLists/hooks';

function useInitializeOpenKeyNav() {
  const { savedPreferences } = useSavedPreferences();

  if (savedPreferences.enableOpenKeyNav) {
    const openKeyNav = new OpenKeyNav();
    openKeyNav.init({
      keys: {
        menu: '/',
        modifierKey: 'metaKey',
      },
      debug: {
        keyboardAccessible: false,
      },
    });
  }
}

function OpenKeyNavInitializer() {
  useInitializeOpenKeyNav();

  return null;
}

export default OpenKeyNavInitializer;
