import React, { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { ExistsValues, isExistsFilter, useSearchStore } from '../store';
import { StyledCheckBoxBlankIcon, StyledCheckBoxIcon, StyledCheckbox, StyledFormControlLabel } from './style';
import { getFieldLabel } from '../fieldConfigurations';
import FacetAccordion from './FacetAccordion';

function ExistsFacet({ filter, field }: { filter: ExistsValues; field: string }) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const filterExists = useSearchStore((state) => state.filterExists);

  const active = filter.values;
  const fieldLabel = getFieldLabel(field);

  const handleClick = useCallback(() => {
    filterExists({ field });

    const facetAction = active ? 'Unselect' : 'Select';
    trackEvent({
      category: analyticsCategory,
      action: `${facetAction} Facet`,
      label: field,
    });
  }, [active, analyticsCategory, filterExists, field]);

  return (
    <FacetAccordion title={fieldLabel} position="inner">
      <StyledFormControlLabel
        control={
          <StyledCheckbox
            checked={active}
            name={`${fieldLabel}-checkbox`}
            color="primary"
            icon={<StyledCheckBoxBlankIcon />}
            checkedIcon={<StyledCheckBoxIcon />}
            onChange={handleClick}
          />
        }
        label="True"
      />
    </FacetAccordion>
  );
}

function ExistsFacetGuard({ field }: { field: string }) {
  const filter = useSearchStore((state) => state.filters[field]);

  if (!isExistsFilter(filter)) {
    return null;
  }

  return <ExistsFacet filter={filter} field={field} />;
}

export default ExistsFacetGuard;
