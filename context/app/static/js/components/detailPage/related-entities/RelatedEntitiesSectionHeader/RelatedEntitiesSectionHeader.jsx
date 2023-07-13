import React from 'react';
import Button from '@material-ui/core/Button';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

function RelatedEntitiesSectionHeader({ header, searchPageHref }) {
  return (
    <SpacedSectionButtonRow
      leftText={
        <div>
          <SectionHeader iconTooltipText="HuBMAP data created or used by the publication.">{header}</SectionHeader>
        </div>
      }
      buttons={
        <Button
          variant="contained"
          color="primary"
          component="a"
          href={searchPageHref}
          data-testid="view-related-data-button"
        >
          View Data on Search Page
        </Button>
      }
    />
  );
}

export default RelatedEntitiesSectionHeader;
