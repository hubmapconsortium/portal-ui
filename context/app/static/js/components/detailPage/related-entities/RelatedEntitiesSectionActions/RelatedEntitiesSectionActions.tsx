import React from 'react';
import Button from '@mui/material/Button';

import { useFlaskDataContext } from 'js/components/Contexts';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface RelatedEntitiesSectionHeaderProps {
  searchPageHref: string;
}

export function RelatedEntitiesSectionActions({ searchPageHref }: RelatedEntitiesSectionHeaderProps) {
  const {
    entity: { uuid },
  } = useFlaskDataContext();

  const track = useTrackEntityPageEvent();

  return (
    <Button
      variant="contained"
      color="primary"
      component="a"
      href={searchPageHref}
      onClick={() =>
        track({
          action: `Derived Datasets Navigation / Navigate to Derived Datasets Search Page`,
          label: uuid,
        })
      }
      data-testid="view-related-data-button"
    >
      View Data on Search Page
    </Button>
  );
}

export default RelatedEntitiesSectionActions;
