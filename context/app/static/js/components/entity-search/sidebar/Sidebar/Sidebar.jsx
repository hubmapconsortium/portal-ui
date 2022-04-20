import React from 'react';

import Facets from 'js/components/entity-search/facets/Facets';
import ConfigureSearch from 'js/components/entity-search/sidebar/ConfigureSearch';
import { SidebarLayout } from './style';

function Sidebar({ results }) {
  return (
    <SidebarLayout>
      <ConfigureSearch />
      {results?.facets && <Facets resultsFacets={results.facets} />}
    </SidebarLayout>
  );
}

export default Sidebar;
