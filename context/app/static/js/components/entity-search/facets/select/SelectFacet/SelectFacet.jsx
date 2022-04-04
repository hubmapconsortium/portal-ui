import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';

import { useSearchkit } from '@searchkit/client';
import CheckboxFilterItem from '../CheckboxFilterItem/CheckboxFilterItem';

function SelectFacet({ facet: { entries, identifier } }) {
  const api = useSearchkit();

  return (
    <FormGroup>
      {entries.map(({ label, count }) => (
        <CheckboxFilterItem
          key={`${identifier}.${label}`}
          label={label}
          count={count}
          onClick={() => {}}
          active={api.isFilterSelected({ identifier, value: label })}
          identifier={identifier}
        />
      ))}
    </FormGroup>
  );
}

export default SelectFacet;
