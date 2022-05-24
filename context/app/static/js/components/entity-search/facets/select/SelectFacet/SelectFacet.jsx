import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';

import { useSearchkit } from '@searchkit/client';
import SelectFacetItem from 'js/components/entity-search/facets/select/SelectFacetItem';

function SelectFacet({ facet: { entries, identifier } }) {
  const api = useSearchkit();

  return (
    <FormGroup>
      {entries.map(({ label: entryLabel, count }) => (
        <SelectFacetItem
          key={`${identifier}.${entryLabel}`}
          label={entryLabel}
          count={count}
          active={api.isFilterSelected({ identifier, value: entryLabel })}
          identifier={identifier}
        />
      ))}
    </FormGroup>
  );
}

export default SelectFacet;
