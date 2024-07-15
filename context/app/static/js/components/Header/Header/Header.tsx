import React from 'react';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';
import { useEntityHeaderVisibility } from './hooks';

function Header() {
  const { shouldDisplayHeader, ...props } = useEntityHeaderVisibility();

  return (
    <>
      <HeaderAppBar {...props}>
        <HeaderContent />
      </HeaderAppBar>
      {shouldDisplayHeader && <EntityHeader />}
    </>
  );
}

export default Header;
