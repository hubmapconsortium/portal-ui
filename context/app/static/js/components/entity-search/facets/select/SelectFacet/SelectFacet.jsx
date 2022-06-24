import React from 'react';
import { useSearchkit } from '@searchkit/client';

import SelectFacetItem from 'js/components/entity-search/facets/select/SelectFacetItem';
import SelectFacetViewButton from 'js/components/entity-search/facets/select/SelectFacetViewButton';

import { StyledFormGroup } from './style';

function SelectFacet({ facet: { entries, identifier, sumOtherDocCount } }) {
  const api = useSearchkit();

  return (
    <>
      <StyledFormGroup>
        {entries.map(({ label: entryLabel, count }) => (
          <SelectFacetItem
            key={`${identifier}.${entryLabel}`}
            label={entryLabel}
            count={count}
            active={api.isFilterSelected({ identifier, value: entryLabel })}
            identifier={identifier}
          />
        ))}
      </StyledFormGroup>
      <SelectFacetViewButton identifier={identifier} sumOtherDocCount={sumOtherDocCount} />
    </>
  );
}

export default SelectFacet;
