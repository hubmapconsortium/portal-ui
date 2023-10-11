import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';
import { defaultSelectFacetSize } from 'js/components/entity-search/SearchWrapper/utils';

const sharedButtonProps = {
  variant: 'text',
  size: 'small',
  color: 'primary',
};

function SelectFacetViewButton({ identifier, sumOtherDocCount }) {
  const { setFacetSize } = useSearchConfigStore();
  const [isViewingAll, setIsViewingAll] = useState(false);

  function handleViewAll() {
    setFacetSize({ identifier, size: 10000 });
    setIsViewingAll(true);
  }

  function handleViewLess() {
    setFacetSize({ identifier, size: defaultSelectFacetSize });
    setIsViewingAll(false);
  }

  if (!isViewingAll && sumOtherDocCount === 0) {
    return null;
  }

  return isViewingAll ? (
    <Button {...sharedButtonProps} onClick={handleViewLess}>
      View less
    </Button>
  ) : (
    <Button {...sharedButtonProps} onClick={handleViewAll}>
      View all
    </Button>
  );
}

export default SelectFacetViewButton;
