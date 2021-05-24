import React from 'react';
import Button from '@material-ui/core/Button';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';

function DerivedEntitiesSectionHeader({ header, entityCountsText, uuid, entityType }) {
  return (
    <StyledButtonRow
      leftText={
        <div>
          <SectionHeader>{header}</SectionHeader>
          <BottomAlignedTypography variant="subtitle1" color="primary">
            {entityCountsText}
          </BottomAlignedTypography>
        </div>
      }
      buttons={
        <Button
          variant="contained"
          color="primary"
          component="a"
          href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entityType}`}
        >
          View Data on Search Page
        </Button>
      }
    />
  );
}

export default DerivedEntitiesSectionHeader;
