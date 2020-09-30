import React, { useRef } from 'react';

import EntityHeader from 'js/components/Detail/entityHeader/EntityHeader';
import useEntityStore from 'js/stores/useEntityStore';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

const entityStoreSelector = (state) => state.summaryInView;

function Header() {
  const anchorRef = useRef(null);
  const summaryInView = useEntityStore(entityStoreSelector);
  const displayEntityHeader =
    !summaryInView &&
    window.location.pathname.startsWith('/browse') &&
    !window.location.pathname.startsWith('/browse/collection');

  return (
    <>
      <HeaderAppBar anchorRef={anchorRef} elevation={displayEntityHeader ? 0 : 4}>
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {displayEntityHeader && <EntityHeader />}
    </>
  );
}

export default Header;
