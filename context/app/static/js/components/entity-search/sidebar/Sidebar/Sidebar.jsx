import React from 'react';

import Facets from 'js/components/entity-search/facets/Facets';
import { SidebarLayout } from './style';

function Sidebar({ results }) {
  return <SidebarLayout>{results?.facets && <Facets resultsFacets={results.facets} />}</SidebarLayout>;
}

export default Sidebar;
