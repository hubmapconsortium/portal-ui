import React, { useRef } from 'react';

import EntityHeader from 'js/components/Detail/entityHeader/EntityHeader';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

const visualizationSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

function Header() {
  const anchorRef = useRef(null);
  const displayEntityHeader =
    window.location.pathname.startsWith('/browse') && !window.location.pathname.startsWith('/browse/collection');

  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  return (
    <>
      <HeaderAppBar
        anchorRef={anchorRef}
        elevation={displayEntityHeader ? 0 : 4}
        shouldConstrainWidth={!vizIsFullscreen}
      >
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {displayEntityHeader && <EntityHeader />}
    </>
  );
}

export default Header;
