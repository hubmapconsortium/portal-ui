import React, { useRef } from 'react';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

function Header() {
  const anchorRef = useRef(null);

  return (
    <HeaderAppBar anchorRef={anchorRef}>
      <HeaderContent anchorRef={anchorRef} />
    </HeaderAppBar>
  );
}

export default Header;
