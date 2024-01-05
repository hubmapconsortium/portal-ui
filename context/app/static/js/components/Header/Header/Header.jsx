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

const pathsWithEntityHeader = ['/browse', '/cell-types', '/genes'];

const exceptionPaths = ['/browse/collection'];

function locationStartsWithPath(path) {
  return window.location.pathname.startsWith(path);
}

function Header() {
  const anchorRef = useRef(null);
  const { summaryInView, summaryEntry } = useEntityStore(entityStoreSelector);
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const displayEntityHeader =
    (summaryEntry &&
      pathsWithEntityHeader.some(locationStartsWithPath) &&
      !exceptionPaths.some(locationStartsWithPath)) ||
    vizIsFullscreen;

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
