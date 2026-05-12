import React, { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { useSearchStore } from '../store';
import { useSearch } from '../Search';
import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';
import FacetAccordion from './FacetAccordion';

function IncludeSupersededFacet() {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const includeSupersededEntities = useSearchStore((state) => state.includeSupersededEntities);
  const setIncludeSupersededEntities = useSearchStore((state) => state.setIncludeSupersededEntities);
  const { isLoading } = useSearch();

  const handleClick = useCallback(() => {
    const next = !includeSupersededEntities;
    setIncludeSupersededEntities(next);
    trackEvent({
      category: analyticsCategory,
      action: `${next ? 'Select' : 'Unselect'} Facet`,
      label: 'Include Superseded Entities',
    });
  }, [analyticsCategory, includeSupersededEntities, setIncludeSupersededEntities]);

  // Hide until other facets have loaded their aggregations, for visual consistency
  // with the rest of the sidebar.
  if (isLoading) {
    return null;
  }

  return (
    <FacetAccordion title="Superseded" position="inner">
      <StyledFormControlLabel
        control={
          <StyledCheckbox
            checked={includeSupersededEntities}
            name="include-superseded-checkbox"
            color="primary"
            icon={<StyledCheckBoxBlankIcon />}
            checkedIcon={<StyledCheckBoxIcon />}
            onChange={handleClick}
            data-testid="include-superseded-checkbox"
          />
        }
        label="Include superseded entities"
      />
    </FacetAccordion>
  );
}

export default IncludeSupersededFacet;
