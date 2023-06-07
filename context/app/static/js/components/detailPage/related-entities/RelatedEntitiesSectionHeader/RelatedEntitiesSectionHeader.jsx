import React from 'react';
import Button from '@mui/material/Button';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

function RelatedEntitiesSectionHeader({ header, searchPageHref }) {
  return (
    <SpacedSectionButtonRow
      leftText={
        <div>
          <SectionHeader>{header}</SectionHeader>
        </div>
      }
      buttons={
        <Button variant="contained" color="primary" component="a" href={searchPageHref}>
          View Data on Search Page
        </Button>
      }
    />
  );
}

export default RelatedEntitiesSectionHeader;
