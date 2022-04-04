import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';

import { useSearchkit } from '@searchkit/client';
import CheckboxFilterItem from '../CheckboxFilterItem/CheckboxFilterItem';
import FacetAccordion from '../../FacetAccordion';

function SelectFacet({ facet: { entries, identifier, label } }) {
  const api = useSearchkit();

  return (
    <FacetAccordion identifier={identifier} label={label}>
      <FormGroup>
        {entries.map(({ label: entryLabel, count }) => (
          <CheckboxFilterItem
            key={`${identifier}.${entryLabel}`}
            label={entryLabel}
            count={count}
            active={api.isFilterSelected({ identifier, value: entryLabel })}
            identifier={identifier}
          />
        ))}
      </FormGroup>
    </FacetAccordion>
  );
}

export default SelectFacet;
