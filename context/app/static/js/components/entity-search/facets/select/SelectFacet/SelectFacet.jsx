import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useSearchkit } from '@searchkit/client';

import SelectFacetItem from 'js/components/entity-search/facets/select/SelectFacetItem';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { defaultSelectFacetSize } from 'js/components/entity-search/SearchWrapper/utils';
import { StyledFormGroup } from './style';

const sharedButtonProps = {
  variant: 'text',
  size: 'small',
  color: 'primary',
};

function SelectFacet({ facet: { entries, identifier } }) {
  const api = useSearchkit();
  const { setFacetSize } = useStore();
  const [isViewingAll, setIsViewingAll] = useState(false);

  function handleViewAll() {
    setFacetSize({ identifier, size: 10000 });
    setIsViewingAll(true);
  }

  function handleViewLess() {
    setFacetSize({ identifier, size: defaultSelectFacetSize });
    setIsViewingAll(false);
  }
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
      {isViewingAll ? (
        <Button {...sharedButtonProps} onClick={handleViewLess}>
          View less
        </Button>
      ) : (
        <Button {...sharedButtonProps} onClick={handleViewAll}>
          View all
        </Button>
      )}
    </>
  );
}

export default SelectFacet;
