import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { defaultSelectFacetSize } from 'js/components/entity-search/SearchWrapper/utils';

const sharedButtonProps = {
  variant: 'text',
  size: 'small',
  color: 'primary',
};

function SelectFacetViewButton({ identifier, sumOtherDocCount }) {
  const { setFacetSize } = useStore();
  const [isViewingAll, setIsViewingAll] = useState(false);

  const handleViewAll = useCallback(
    function handleViewAll() {
      setFacetSize({ identifier, size: 10000 });
      setIsViewingAll(true);
    },
    [identifier, setFacetSize],
  );

  const handleViewLess = useCallback(
    function handleViewLess() {
      setFacetSize({ identifier, size: defaultSelectFacetSize });
      setIsViewingAll(false);
    },
    [identifier, setFacetSize],
  );

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
