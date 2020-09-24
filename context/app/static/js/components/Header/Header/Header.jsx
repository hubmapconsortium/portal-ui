import React, { useRef } from 'react';

import useStore from 'js/components/store';
import DetailHeader from 'js/components/Detail/Header';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

function Header() {
  const anchorRef = useRef(null);
  const summaryInView = useStore((state) => state.summaryInView);

  return (
    <>
      <HeaderAppBar anchorRef={anchorRef}>
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {!summaryInView && <DetailHeader />}
    </>
  );
}

export default Header;
