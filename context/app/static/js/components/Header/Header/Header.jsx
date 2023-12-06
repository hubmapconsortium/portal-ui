import React, { useRef } from 'react';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import useEntityStore from 'js/stores/useEntityStore';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

const entityStoreSelector = (state) => state.summaryComponentObserver;
const visualizationSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

function Header() {
  const anchorRef = useRef(null);
  const { summaryInView, summaryEntry } = useEntityStore(entityStoreSelector);
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const displayEntityHeader =
    (summaryEntry &&
      window.location.pathname.startsWith('/browse') &&
      !window.location.pathname.startsWith('/browse/collection')) ||
    vizIsFullscreen ||
    window.location.pathname.startsWith('/cell-types');

  return (
    <>
      <HeaderAppBar
        anchorRef={anchorRef}
        elevation={!summaryInView || vizIsFullscreen ? 0 : 4}
        shouldConstrainWidth={!vizIsFullscreen}
      >
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {displayEntityHeader && <EntityHeader />}
    </>
  );
}

export default Header;
