import React, { useRef } from 'react';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';
import { useEntityHeaderVisibility } from './hooks';

function Header() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { shouldDisplayHeader, ...props } = useEntityHeaderVisibility();

  return (
    <>
      <HeaderAppBar anchorRef={anchorRef} {...props}>
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {shouldDisplayHeader && <EntityHeader />}
    </>
  );
}

export default Header;
