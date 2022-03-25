import React, { useRef } from 'react';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

const visualizationSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

function Header({ assayMetadata }) {
  const anchorRef = useRef(null);
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const displayEntityHeader =
    (window.location.pathname.startsWith('/browse') && !window.location.pathname.startsWith('/browse/collection')) ||
    vizIsFullscreen;

  return (
    <>
      <HeaderAppBar
        anchorRef={anchorRef}
        elevation={!displayEntityHeader ? 0 : 4}
        shouldConstrainWidth={!vizIsFullscreen}
      >
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {displayEntityHeader && <EntityHeader assayMetadata={assayMetadata} />}
    </>
  );
}

export default Header;
