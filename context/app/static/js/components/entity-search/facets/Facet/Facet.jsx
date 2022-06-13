import React from 'react';

import FacetAccordion from 'js/components/entity-search/facets/FacetAccordion';
import RangeSliderFacet from 'js/components/entity-search/searchkit-modifications/RangeSliderFacet';
import SelectFacet from 'js/components/entity-search/facets/select/SelectFacet';

const facetTypeToComponentMap = {
  RangeFacet: RangeSliderFacet,
  RefinementSelectFacet: SelectFacet,
};

function Facet({ facet }) {
  const FacetComponent = facetTypeToComponentMap[facet.type];

  return (
    <FacetAccordion identifier={facet.identifier} label={facet.label}>
      <FacetComponent facet={facet} />
    </FacetAccordion>
  );
}

export default Facet;
